#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

// DTCG Token interfaces
interface DTCGToken {
  $value: string | number;
  $type: string;
  $description?: string;
}

// Validation result interfaces
interface ValidationResult {
  dtcgValid: boolean;
  hasSemanticNames: boolean;
  darkModeKeysMirror: boolean;
  potentialContrastRisks: string[];
  issues: ValidationIssue[];
}

interface ValidationIssue {
  type: 'dtcg' | 'semantic' | 'darkmode' | 'contrast';
  severity: 'error' | 'warning';
  path: string;
  message: string;
}

// Color utilities for contrast calculation
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3]
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function calculateLuminance(r: number, g: number, b: number): number {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  const rsProcessed = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gsProcessed = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bsProcessed = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

  return 0.2126 * rsProcessed + 0.7152 * gsProcessed + 0.0722 * bsProcessed;
}

function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function isValidDTCGToken(token: any): token is DTCGToken {
  return (
    typeof token === 'object' &&
    token !== null &&
    '$value' in token &&
    '$type' in token &&
    typeof token.$type === 'string'
  );
}

function isValidTokenType(type: string): boolean {
  const validTypes = [
    'color',
    'dimension',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'borderWidth',
    'borderRadius',
    'shadow',
    'opacity',
    'duration',
    'cubicBezier',
  ];
  return validTypes.includes(type);
}

function flattenTokens(obj: any, prefix = ''): Map<string, any> {
  const tokens = new Map<string, any>();

  function traverse(current: any, path: string) {
    if (isValidDTCGToken(current)) {
      tokens.set(path, current);
    } else if (typeof current === 'object' && current !== null) {
      for (const [key, value] of Object.entries(current)) {
        traverse(value, path ? `${path}.${key}` : key);
      }
    }
  }

  traverse(obj, prefix);
  return tokens;
}

function validateDTCGFormat(tokens: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const flatTokens = flattenTokens(tokens);

  for (const [path, token] of flatTokens) {
    if (!isValidDTCGToken(token)) {
      issues.push({
        type: 'dtcg',
        severity: 'error',
        path,
        message: 'Invalid DTCG token format: missing $value or $type',
      });
    } else {
      if (!isValidTokenType(token.$type)) {
        issues.push({
          type: 'dtcg',
          severity: 'warning',
          path,
          message: `Invalid token type: ${token.$type}`,
        });
      }

      if (token.$description && typeof token.$description !== 'string') {
        issues.push({
          type: 'dtcg',
          severity: 'warning',
          path,
          message: '$description should be a string',
        });
      }
    }
  }

  return issues;
}

function validateSemanticNames(tokens: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const flatTokens = flattenTokens(tokens);
  const hexValues = new Map<string, string[]>();
  const semanticNames = new Set<string>();

  // Collect hex values and semantic names
  for (const [path, token] of flatTokens) {
    if (token.$type === 'color' && typeof token.$value === 'string') {
      const hexMatch = token.$value.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
      if (hexMatch) {
        const hex = token.$value.toLowerCase();
        if (!hexValues.has(hex)) {
          hexValues.set(hex, []);
        }
        hexValues.get(hex)!.push(path);
      } else {
        semanticNames.add(token.$value);
      }
    }
  }

  // Check for duplicate hex values
  for (const [hex, paths] of hexValues) {
    if (paths.length > 1) {
      issues.push({
        type: 'semantic',
        severity: 'warning',
        path: paths.join(', '),
        message: `Duplicate hex value ${hex} found at multiple paths`,
      });
    }
  }

  return issues;
}

function validateDarkModeConsistency(designTokens: any, darkTokens: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const designFlat = flattenTokens(designTokens);
  const darkFlat = flattenTokens(darkTokens);

  // Check that all design token paths exist in dark mode
  for (const [path] of designFlat) {
    if (!darkFlat.has(path)) {
      issues.push({
        type: 'darkmode',
        severity: 'error',
        path,
        message: 'Missing in dark mode tokens',
      });
    }
  }

  // Check that dark mode tokens have the same structure
  for (const [path, darkToken] of darkFlat) {
    const designToken = designFlat.get(path);
    if (designToken) {
      if (designToken.$type !== darkToken.$type) {
        issues.push({
          type: 'darkmode',
          severity: 'error',
          path,
          message: `Type mismatch: expected ${designToken.$type}, got ${darkToken.$type}`,
        });
      }
    }
  }

  return issues;
}

function validateContrastRatios(tokens: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const flatTokens = flattenTokens(tokens);
  const colorTokens = new Map<string, string>();

  // Collect all color tokens
  for (const [path, token] of flatTokens) {
    if (token.$type === 'color' && typeof token.$value === 'string') {
      if (token.$value.startsWith('#')) {
        colorTokens.set(path, token.$value);
      }
    }
  }

  // Find text and background combinations
  const textTokens = Array.from(colorTokens.entries()).filter(
    ([path]) => path.includes('text') || path.includes('foreground')
  );
  const bgTokens = Array.from(colorTokens.entries()).filter(
    ([path]) => path.includes('background') || path.includes('bg')
  );

  // Calculate contrast ratios
  for (const [textPath, textColor] of textTokens) {
    for (const [bgPath, bgColor] of bgTokens) {
      const ratio = calculateContrastRatio(textColor, bgColor);
      if (ratio < 4.5) {
        // AA standard for normal text
        issues.push({
          type: 'contrast',
          severity: 'warning',
          path: `${textPath} on ${bgPath}`,
          message: `Low contrast ratio: ${ratio.toFixed(2)} (should be >= 4.5 for AA compliance)`,
        });
      }
    }
  }

  return issues;
}

function generateMarkdownReport(result: ValidationResult): string {
  const status =
    result.dtcgValid &&
    result.hasSemanticNames &&
    result.darkModeKeysMirror &&
    result.potentialContrastRisks.length === 0
      ? 'PASS'
      : 'FAIL';

  let report = `# Tokens Validation Report\n\n`;
  report += `**Overall Status:** ${status}\n\n`;

  report += `## Summary\n\n`;
  report += `- DTCG Format Valid: ${result.dtcgValid ? '✅' : '❌'}\n`;
  report += `- Semantic Names: ${result.hasSemanticNames ? '✅' : '❌'}\n`;
  report += `- Dark Mode Consistency: ${result.darkModeKeysMirror ? '✅' : '❌'}\n`;
  report += `- Contrast Risks: ${result.potentialContrastRisks.length === 0 ? '✅' : '❌'}\n\n`;

  if (result.issues.length > 0) {
    report += `## Issues Found\n\n`;
    const errors = result.issues.filter(i => i.severity === 'error');
    const warnings = result.issues.filter(i => i.severity === 'warning');

    if (errors.length > 0) {
      report += `### Errors (${errors.length})\n\n`;
      for (const issue of errors) {
        report += `- **${issue.path}**: ${issue.message}\n`;
      }
      report += '\n';
    }

    if (warnings.length > 0) {
      report += `### Warnings (${warnings.length})\n\n`;
      for (const issue of warnings) {
        report += `- **${issue.path}**: ${issue.message}\n`;
      }
      report += '\n';
    }
  }

  if (result.potentialContrastRisks.length > 0) {
    report += `## Contrast Issues\n\n`;
    for (const risk of result.potentialContrastRisks) {
      report += `- ${risk}\n`;
    }
    report += '\n';
  }

  report += `## Recommendations\n\n`;
  if (!result.dtcgValid) {
    report += `- Ensure all tokens follow DTCG format with $value and $type properties\n`;
    report += `- Use valid token types: color, dimension, fontFamily, fontSize, etc.\n`;
  }
  if (!result.hasSemanticNames) {
    report += `- Replace duplicate hex values with semantic token references\n`;
    report += `- Use meaningful names for colors instead of raw hex values\n`;
  }
  if (!result.darkModeKeysMirror) {
    report += `- Ensure dark mode tokens mirror all keys from design tokens\n`;
    report += `- Maintain consistent token structure between light and dark themes\n`;
  }
  if (result.potentialContrastRisks.length > 0) {
    report += `- Fix contrast ratios to meet WCAG AA standards (4.5:1 for normal text)\n`;
    report += `- Test color combinations using automated contrast checkers\n`;
  }

  return report;
}

async function main() {
  try {
    // Read token files
    const designTokensPath = path.join(process.cwd(), 'specs/tokens/design-tokens.json');
    const darkTokensPath = path.join(process.cwd(), 'specs/tokens/dark-mode-tokens.json');

    const designTokens = JSON.parse(fs.readFileSync(designTokensPath, 'utf-8'));
    const darkTokens = JSON.parse(fs.readFileSync(darkTokensPath, 'utf-8'));

    // Run all validations
    const allIssues: ValidationIssue[] = [
      ...validateDTCGFormat(designTokens),
      ...validateDTCGFormat(darkTokens),
      ...validateSemanticNames(designTokens),
      ...validateDarkModeConsistency(designTokens, darkTokens),
      ...validateContrastRatios(designTokens),
      ...validateContrastRatios(darkTokens),
    ];

    // Calculate results
    const dtcgValid = !allIssues.some(i => i.type === 'dtcg' && i.severity === 'error');
    const hasSemanticNames = !allIssues.some(i => i.type === 'semantic');
    const darkModeKeysMirror = !allIssues.some(i => i.type === 'darkmode');
    const contrastIssues = allIssues.filter(i => i.type === 'contrast');
    const potentialContrastRisks = contrastIssues.map(i => `${i.path}: ${i.message}`);

    const result: ValidationResult = {
      dtcgValid,
      hasSemanticNames,
      darkModeKeysMirror,
      potentialContrastRisks,
      issues: allIssues,
    };

    // Write JSON report
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(reportsDir, 'tokens.json'),
      JSON.stringify(
        {
          dtcgValid: result.dtcgValid,
          hasSemanticNames: result.hasSemanticNames,
          darkModeKeysMirror: result.darkModeKeysMirror,
          potentialContrastRisks: result.potentialContrastRisks,
        },
        null,
        2
      )
    );

    // Write markdown report
    fs.writeFileSync(path.join(reportsDir, 'tokens.md'), generateMarkdownReport(result));

    console.log('✅ Token validation complete!');
    console.log(`📊 Reports generated in /reports/tokens.json and /reports/tokens.md`);
  } catch (error) {
    console.error('❌ Error during validation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
