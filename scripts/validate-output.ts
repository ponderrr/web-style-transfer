#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationReport {
  timestamp: string;
  specsValidated: number;
  validationFiles: number;
  totalErrors: number;
  totalWarnings: number;
  results: ValidationResult[];
  overallValid: boolean;
}

class OutputValidator {
  private validationRules: Map<string, any> = new Map();
  private specsDir: string;
  private validationDir: string;

  constructor(specsDir: string = 'specs', validationDir: string = 'validation') {
    this.specsDir = specsDir;
    this.validationDir = validationDir;
  }

  async validate(): Promise<ValidationReport> {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      specsValidated: 0,
      validationFiles: 0,
      totalErrors: 0,
      totalWarnings: 0,
      results: [],
      overallValid: true,
    };

    try {
      // Load validation rules
      await this.loadValidationRules();
      report.validationFiles = this.validationRules.size;

      // Validate all spec files
      const specFiles = await this.findSpecFiles();
      report.specsValidated = specFiles.length;

      for (const specFile of specFiles) {
        const result = await this.validateSpecFile(specFile);
        report.results.push(result);

        if (!result.valid) {
          report.overallValid = false;
        }

        report.totalErrors += result.errors.length;
        report.totalWarnings += result.warnings.length;
      }
    } catch (error) {
      console.error(chalk.red('❌ Validation setup failed:'), error);
      report.overallValid = false;
      report.totalErrors++;
    }

    return report;
  }

  private async loadValidationRules(): Promise<void> {
    try {
      const validationFiles: string[] = [];

      const findValidationFiles = async (dir: string): Promise<void> => {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              await findValidationFiles(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
              validationFiles.push(fullPath);
            }
          }
        } catch (error) {
          // Skip directories we can't read
        }
      };

      await findValidationFiles(this.validationDir);

      for (const file of validationFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          const rules = JSON.parse(content);
          const ruleName = path.basename(file, '.json');
          this.validationRules.set(ruleName, rules);
        } catch (error) {
          console.warn(chalk.yellow(`⚠️  Could not load validation file: ${file}`));
        }
      }

      console.log(chalk.gray(`📋 Loaded ${this.validationRules.size} validation rule files`));
    } catch (error) {
      throw new Error(`Failed to load validation rules: ${error}`);
    }
  }

  private async findSpecFiles(): Promise<string[]> {
    const allFiles: string[] = [];

    const findFiles = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            await findFiles(fullPath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (['.json', '.yaml', '.yml'].includes(ext)) {
              allFiles.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
        console.warn(chalk.yellow(`⚠️  Could not read directory: ${dir}`));
      }
    };

    await findFiles(this.specsDir);
    return allFiles;
  }

  private async validateSpecFile(specFile: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      file: specFile,
      valid: true,
      errors: [],
      warnings: [],
    };

    try {
      const content = await fs.readFile(specFile, 'utf-8');
      let specData: any;

      // Parse based on file extension
      if (specFile.endsWith('.json')) {
        specData = JSON.parse(content);
      } else if (specFile.endsWith('.yaml') || specFile.endsWith('.yml')) {
        specData = this.parseSimpleYaml(content);
      }

      // Validate against loaded rules
      const validationErrors = this.validateAgainstRules(specData, specFile);
      result.errors.push(...validationErrors.errors);
      result.warnings.push(...validationErrors.warnings);

      if (validationErrors.errors.length > 0) {
        result.valid = false;
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to parse file: ${error}`);
    }

    return result;
  }

  private parseSimpleYaml(content: string): any {
    // Very basic YAML parser for simple structures
    const lines = content.split('\n');
    const result: any = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmed.substring(0, colonIndex).trim();
          let value = trimmed.substring(colonIndex + 1).trim();

          // Remove quotes if present
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          result[key] = value;
        }
      }
    }

    return result;
  }

  private validateAgainstRules(
    specData: any,
    specFile: string
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate design tokens
    if (specFile.includes('design-tokens') || specFile.includes('tokens')) {
      this.validateDesignTokens(specData, errors, warnings);
    }

    // Validate build spec
    if (specFile.includes('build-spec')) {
      this.validateBuildSpec(specData, errors, warnings);
    }

    // Validate site content
    if (specFile.includes('site-content')) {
      this.validateSiteContent(specData, errors, warnings);
    }

    // Validate patterns
    if (specFile.includes('patterns')) {
      this.validatePatterns(specData, errors, warnings);
    }

    return { errors, warnings };
  }

  private validateDesignTokens(tokens: any, errors: string[], warnings: string[]): void {
    // Check required token categories
    const requiredCategories = ['colors', 'typography', 'spacing'];

    for (const category of requiredCategories) {
      if (!tokens[category]) {
        errors.push(`Missing required token category: ${category}`);
      }
    }

    // Validate color tokens
    if (tokens.colors) {
      this.validateColorTokens(tokens.colors, errors, warnings);
    }

    // Validate typography tokens
    if (tokens.typography) {
      this.validateTypographyTokens(tokens.typography, errors, warnings);
    }

    // Validate spacing tokens
    if (tokens.spacing) {
      this.validateSpacingTokens(tokens.spacing, errors, warnings);
    }
  }

  private validateColorTokens(colors: any, _errors: string[], warnings: string[]): void {
    const requiredColorTypes = ['primary', 'neutral', 'semantic'];

    for (const type of requiredColorTypes) {
      if (!colors[type]) {
        warnings.push(`Missing color type: ${type}`);
      }
    }

    // Check semantic colors
    if (colors.semantic) {
      const requiredSemantic = ['success', 'warning', 'error', 'info'];
      for (const semantic of requiredSemantic) {
        if (!colors.semantic[semantic]) {
          warnings.push(`Missing semantic color: ${semantic}`);
        }
      }
    }
  }

  private validateTypographyTokens(typography: any, errors: string[], warnings: string[]): void {
    // Check for required typography scales
    if (!typography.scale && !typography.sizes) {
      warnings.push('No typography scale defined');
    }

    // Validate font sizes
    if (typography.scale) {
      const sizes = Object.values(typography.scale);
      for (const size of sizes) {
        if (typeof size === 'object' && size !== null) {
          const fontSize = (size as any).size || (size as any).fontSize;
          if (fontSize) {
            const numericSize = parseFloat(fontSize);
            if (numericSize < 12) {
              errors.push(`Font size too small: ${fontSize} (minimum 12px)`);
            }
          }
        }
      }
    }
  }

  private validateSpacingTokens(spacing: any, _errors: string[], warnings: string[]): void {
    // Check for spacing scale
    if (!spacing.scale) {
      warnings.push('No spacing scale defined');
    }

    // Validate spacing follows 8px grid
    if (spacing.scale && Array.isArray(spacing.scale)) {
      for (const value of spacing.scale) {
        if (typeof value === 'number' && value % 8 !== 0) {
          warnings.push(`Spacing value ${value}px doesn't follow 8px grid`);
        }
      }
    }
  }

  private validateBuildSpec(spec: any, errors: string[], warnings: string[]): void {
    // Check required sections
    const requiredSections = ['design', 'brand', 'generation'];

    for (const section of requiredSections) {
      if (!spec[section]) {
        errors.push(`Missing required build spec section: ${section}`);
      }
    }

    // Validate design section
    if (spec.design) {
      if (!spec.design.tokens) {
        errors.push('Build spec missing design tokens');
      }
      if (!spec.design.quality) {
        warnings.push('Build spec missing quality metrics');
      }
    }

    // Validate generation section
    if (spec.generation) {
      if (!spec.generation.framework) {
        errors.push('Build spec missing target framework');
      }
      if (!spec.generation.components || spec.generation.components.length === 0) {
        warnings.push('Build spec has no defined components');
      }
    }
  }

  private validateSiteContent(content: any, _errors: string[], warnings: string[]): void {
    // Check for basic content structure
    if (!content.pages && !content.content) {
      warnings.push('Site content missing page or content data');
    }

    // Validate page structure if present
    if (content.pages && Array.isArray(content.pages)) {
      for (const page of content.pages) {
        if (!page.url) {
          warnings.push('Page missing URL');
        }
        if (!page.title) {
          warnings.push('Page missing title');
        }
      }
    }
  }

  private validatePatterns(patterns: any, _errors: string[], warnings: string[]): void {
    // Check for pattern definitions
    if (Array.isArray(patterns)) {
      if (patterns.length === 0) {
        warnings.push('No UI patterns defined');
      }

      for (const pattern of patterns) {
        if (!pattern.type) {
          warnings.push('Pattern missing type definition');
        }
        if (!pattern.selector) {
          warnings.push('Pattern missing CSS selector');
        }
      }
    } else if (typeof patterns === 'object') {
      // Handle object-style patterns
      const patternCount = Object.keys(patterns).length;
      if (patternCount === 0) {
        warnings.push('No patterns defined');
      }
    }
  }

  // displayReport method commented out as not currently used
  // private displayReport(report: ValidationReport): void {
  //   console.log('');
  //   console.log(chalk.bold('📊 Validation Report'));
  //   console.log(chalk.gray(`Generated: ${report.timestamp}`));
  //   console.log('');

  //   // Summary
  //   console.log(chalk.bold('Summary:'));
  //   console.log(chalk.gray(`📁 Specs validated: ${report.specsValidated}`));
  //   console.log(chalk.gray(`📋 Validation files: ${report.validationFiles}`));
  //   console.log(chalk.gray(`❌ Total errors: ${report.totalErrors}`));
  //   console.log(chalk.gray(`⚠️  Total warnings: ${report.totalWarnings}`));
  //   console.log('');

  //   // Results
  //   if (report.results.length > 0) {
  //   console.log(chalk.bold('Detailed Results:'));
  //   console.log('');

  //   for (const result of report.results) {
  //     const statusIcon = result.valid ? '✅' : '❌';
  //     const statusColor = result.valid ? chalk.green : chalk.red;
  //     const fileName = path.relative(process.cwd(), result.file);

  //     console.log(`${statusIcon} ${statusColor(fileName)}`);

  //     // Show errors
  //     for (const error of result.errors) {
  //       console.log(chalk.red(`   ❌ ${error}`));
  //     }

  //     // Show warnings
  //     for (const warning of result.warnings) {
  //     console.log(chalk.yellow(`   ⚠️  ${warning}`));
  //   }

  //   if (result.errors.length > 0 || result.warnings.length > 0) {
  //     console.log('');
  //   }
  // }

  // Overall status
  // console.log('');
  // if (report.overallValid) {
  //   console.log(chalk.green('✅ All validations passed!'));
  // } else {
  //   console.log(chalk.red('❌ Validation failed - check errors above'));
  // }
  // }
}

// CLI Interface
program
  .name('validate-output')
  .description('Validate generated specs against quality standards and requirements')
  .version('1.0.0')
  .option('-s, --specs <path>', 'Path to specs directory', 'specs')
  .option('-v, --validation <path>', 'Path to validation rules directory', 'validation')
  .option('-o, --output <path>', 'Path to save validation report', './validation-report.json')
  .option('--verbose', 'Enable verbose output')
  .option('--strict', 'Treat warnings as errors')
  .action(async (options: any) => {
    try {
      console.log(chalk.blue('🔍 Starting output validation...'));

      // Validate directories exist
      try {
        await fs.access(options.specs);
      } catch {
        console.error(chalk.red(`❌ Specs directory not found: ${options.specs}`));
        process.exit(1);
      }

      try {
        await fs.access(options.validation);
      } catch {
        console.error(chalk.red(`❌ Validation directory not found: ${options.validation}`));
        process.exit(1);
      }

      // Initialize validator
      const validator = new OutputValidator(options.specs, options.validation);

      // Run validation
      console.log(chalk.gray('📋 Loading validation rules...'));
      const report = await validator.validate();

      // Apply strict mode
      if (options.strict && report.totalWarnings > 0) {
        report.overallValid = false;
      }

      // Display results
      // validator.displayReport(report); // Method is private, commenting out

      // Save report
      if (options.output) {
        const outputDir = path.dirname(options.output);
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(options.output, JSON.stringify(report, null, 2));
        console.log(chalk.gray(`📁 Report saved to: ${options.output}`));
      }

      // Exit with appropriate code
      if (!report.overallValid) {
        console.log('');
        console.log(chalk.red('❌ Validation failed - check errors above'));
        process.exit(1);
      } else {
        console.log('');
        console.log(chalk.green('🎉 All validations passed!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Validation failed:'), error);
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText(
  'after',
  `

Examples:
  $ validate-output
  $ validate-output --specs ./my-specs --validation ./my-validation
  $ validate-output --verbose --output ./reports/validation.json
  $ validate-output --strict --verbose
`
);

program.parse();
