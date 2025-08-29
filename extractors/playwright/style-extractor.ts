// Style Extractor
// extractors/playwright/style-extractor.ts
import { chromium, Browser, Page, BrowserContext } from 'playwright';

import {
  DesignTokens,
  ColorToken,
  TypographyToken,
  SpacingScale,
  UIPattern,
  QualityScore,
  ExtractionResult,
} from '../schemas/style.schema';

// Import utility classes
import { PatternDetector } from './pattern-detector';

import { QualityScorer } from './quality-scorer';
import { ColorNormalizer } from './utils/color-normalizer';
import { TypographyAnalyzer } from './utils/typography-analyzer';
import { SpacingDetector } from './utils/spacing-detector';

export class StyleExtractor {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  // Utility class instances
  private patternDetector: PatternDetector;
  private qualityScorer: QualityScorer;
  private colorNormalizer: ColorNormalizer;
  private typographyAnalyzer: TypographyAnalyzer;
  private spacingDetector: SpacingDetector;

  // Operational parameters
  private _baseURL?: string;
  private _maxDepth: number = 3;
  private _respectRobots: boolean = true;
  private _rateLimit: number = 1000; // ms between requests

  constructor(
    options: {
      baseURL?: string;
      maxDepth?: number;
      respectRobots?: boolean;
      rateLimit?: number;
    } = {}
  ) {
    // Initialize utility classes
    this.patternDetector = new PatternDetector();
    this.qualityScorer = new QualityScorer();
    this.colorNormalizer = new ColorNormalizer();
    this.typographyAnalyzer = new TypographyAnalyzer();
    this.spacingDetector = new SpacingDetector();

    // Set operational parameters
    this.baseURL = options.baseURL;
    this.maxDepth = options.maxDepth ?? 3;
    this.respectRobots = options.respectRobots ?? true;
    this.rateLimit = options.rateLimit ?? 1000;
  }

  // S-Tier design standards
  private readonly S_TIER_STANDARDS = {
    spacing: {
      baseUnit: 8,
      allowedMultiples: [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16],
      maxDeviation: 2, // px
    },
    typography: {
      minContrast: 4.5,
      modularScales: [1.125, 1.2, 1.25, 1.333, 1.414, 1.5],
      minLineHeight: 1.4,
      optimalLineHeight: 1.6,
      fontWeights: [300, 400, 500, 600, 700, 800],
    },
    colors: {
      maxPaletteSize: 12,
      semanticRoles: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      neutralSteps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    borderRadius: {
      small: [2, 3, 4, 5, 6],
      medium: [8, 10, 12],
      large: [16, 20, 24],
      full: 9999,
    },
    animations: {
      maxDuration: 400,
      optimalDuration: 250,
      preferredEasing: ['ease-in-out', 'ease-out', 'cubic-bezier(0.4, 0, 0.2, 1)'],
    },
    breakpoints: {
      mobile: 375,
      tablet: 768,
      desktop: 1024,
      wide: 1440,
    },
  };

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.context = await this.browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2, // Retina quality screenshots
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      });
    } catch (error) {
      console.error('❌ Failed to initialize Playwright browser:', error);
      throw new Error(
        `Browser initialization failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async extract(url: string): Promise<ExtractionResult> {
    if (!this.context) await this.initialize();

    console.log(`🎨 Starting S-Tier style extraction for: ${url}`);

    // Check robots.txt if enabled
    if (this.respectRobots) {
      const allowed = await this.checkRobotsTxt(url);
      if (!allowed) {
        throw new Error(`Robots.txt disallows access to: ${url}`);
      }
    }

    // Check baseURL scope if specified
    if (this.baseURL && !url.startsWith(this.baseURL)) {
      console.warn(`⚠️ URL ${url} is outside baseURL scope: ${this.baseURL}`);
    }

    const page = await this.context!.newPage();

    try {
      // Navigate and wait for full load
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for animations to complete
      await page.waitForTimeout(1000);

      // Extract at multiple viewport sizes
      await this.extractAcrossViewports(page);

      // Extract design tokens
      const tokens = await this.extractDesignTokens(page);

      // Detect UI patterns
      const patterns = await this.detectUIPatterns(page);

      // Extract micro-interactions
      const interactions = await this.extractMicroInteractions(page);

      // Calculate quality score
      const qualityScore = await this.calculateQualityScore(tokens, patterns);

      // Generate recommendations
      const recommendations = this.generateRecommendations(tokens, qualityScore);

      const result: ExtractionResult = {
        url,
        timestamp: new Date().toISOString(),
        tokens,
        patterns,
        interactions,
        qualityScore,
        recommendations,
        metadata: {
          extractionDuration: Date.now(),
          viewportsTested: Object.keys(this.S_TIER_STANDARDS.breakpoints),
          extractorVersion: '1.0.0',
        },
      };

      console.log(`✅ Extraction complete. Quality score: ${qualityScore.overall.toFixed(2)}/1.0`);
      return result;
    } finally {
      await page.close();
    }
  }

  private async checkRobotsTxt(url: string): Promise<boolean> {
    try {
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;

      const response = await fetch(robotsUrl);
      if (!response.ok) {
        // If robots.txt doesn't exist, assume access is allowed
        return true;
      }

      const robotsTxt = await response.text();

      // Simple robots.txt parser
      const lines = robotsTxt.split('\n');
      let currentUserAgent = '';
      const disallowed: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('User-agent:')) {
          currentUserAgent = trimmed.split(':')[1].trim();
        } else if (trimmed.startsWith('Disallow:') && currentUserAgent === '*') {
          const path = trimmed.split(':')[1]?.trim();
          if (path) {
            disallowed.push(path);
          }
        }
      }

      // Check if our path is disallowed
      const urlPath = urlObj.pathname + urlObj.search;
      for (const disallowedPath of disallowed) {
        if (urlPath.startsWith(disallowedPath)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      // If we can't check robots.txt, assume access is allowed
      console.warn(`⚠️ Could not check robots.txt for ${url}:`, error);
      return true;
    }
  }

  private async _delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async extractAcrossViewports(page: Page): Promise<Map<string, any>> {
    const results = new Map();

    for (const [name, width] of Object.entries(this.S_TIER_STANDARDS.breakpoints)) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(500); // Allow responsive adjustments

      const viewportData = await page.evaluate(() => {
        // Collect all computed styles at this viewport
        const elements = document.querySelectorAll('*');
        const styles = new Map();

        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();

          // Only track visible elements
          if (rect.width > 0 && rect.height > 0) {
            styles.set(el.tagName, {
              fontSize: computed.fontSize,
              lineHeight: computed.lineHeight,
              fontWeight: computed.fontWeight,
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              padding: computed.padding,
              margin: computed.margin,
              borderRadius: computed.borderRadius,
            });
          }
        });

        return Object.fromEntries(styles);
      });

      results.set(name, viewportData);
    }

    return results;
  }

  private async extractDesignTokens(page: Page): Promise<DesignTokens> {
    // Use enhanced utility classes for better extraction
    console.log('🎨 Extracting colors with advanced normalization...');
    const rawColors = await this.extractColors(page);
    const colorSystem = this.colorNormalizer.normalizeColors(Array.from(rawColors.keys()));

    console.log('📝 Analyzing typography with modular scale detection...');
    const typographyAnalysis = await this.typographyAnalyzer.analyzeTypography(page);

    console.log('📏 Detecting spacing system and grid...');
    const spacingAnalysis = await this.spacingDetector.detectSpacingSystem(page);

    // Extract additional design tokens
    const effects = await this.extractEffects(page);
    const borderRadius = await this.extractBorderRadius(page);

    return {
      colors: this.convertToColorTokens(colorSystem),
      typography: this.convertToTypographyTokens(typographyAnalysis),
      spacing: {
        base: '8px',
        scale: this.convertToSpacingScale(spacingAnalysis),
      },
      effects: this.normalizeEffects(effects),
      borderRadius: this.normalizeBorderRadius(borderRadius),
      breakpoints: {
        mobile: `${this.S_TIER_STANDARDS.breakpoints.mobile}px`,
        tablet: `${this.S_TIER_STANDARDS.breakpoints.tablet}px`,
        desktop: `${this.S_TIER_STANDARDS.breakpoints.desktop}px`,
        wide: `${this.S_TIER_STANDARDS.breakpoints.wide}px`,
      },
    };
  }

  // Conversion methods for utility class outputs
  private convertToColorTokens(colorSystem: any): Record<string, ColorToken> {
    const tokens: Record<string, ColorToken> = {};

    // Add semantic colors
    if (colorSystem.semantic) {
      Object.entries(colorSystem.semantic).forEach(([key, value]) => {
        if (typeof value === 'string') {
          tokens[key] = { $value: value, $type: 'color' };
        }
      });
    }

    // Add neutral scale
    if (colorSystem.tokens) {
      Object.entries(colorSystem.tokens).forEach(([key, token]: [string, any]) => {
        tokens[key] = token;
      });
    }

    return tokens;
  }

  private convertToTypographyTokens(typographyAnalysis: any): Record<string, TypographyToken> {
    const tokens: Record<string, TypographyToken> = {};

    // Add font families
    if (typographyAnalysis.fonts && typographyAnalysis.fonts.length > 0) {
      tokens['fontFamily'] = {
        $value: typographyAnalysis.fonts[0].stack.join(', '),
        $type: 'fontFamily',
      };
    }

    // Add typography scale
    if (typographyAnalysis.scale) {
      Object.entries(typographyAnalysis.scale).forEach(([key, value]: [string, any]) => {
        tokens[`fontSize-${key}`] = {
          $value: value.size || value,
          $type: 'fontSize',
        };

        if (value.lineHeight) {
          tokens[`lineHeight-${key}`] = {
            $value: value.lineHeight,
            $type: 'lineHeight',
          };
        }

        if (value.fontWeight) {
          tokens[`fontWeight-${key}`] = {
            $value: value.fontWeight.toString(),
            $type: 'fontWeight',
          };
        }
      });
    }

    return tokens;
  }

  private convertToSpacingScale(spacingAnalysis: any): SpacingScale {
    return spacingAnalysis.scale || {};
  }

  private async extractColors(page: Page): Promise<Map<string, any>> {
    return await page.evaluate(() => {
      const colors = new Map<string, number>();
      const elements = document.querySelectorAll('*');

      // Helper to increment color count
      const addColor = (color: string) => {
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          colors.set(color, (colors.get(color) || 0) + 1);
        }
      };

      elements.forEach(el => {
        const computed = window.getComputedStyle(el);
        addColor(computed.color);
        addColor(computed.backgroundColor);
        addColor(computed.borderTopColor);
        addColor(computed.borderRightColor);
        addColor(computed.borderBottomColor);
        addColor(computed.borderLeftColor);

        // Check for CSS variables
        const cssVars = computed.cssText.match(/var\(--[^)]+\)/g);
        if (cssVars) {
          cssVars.forEach(varRef => {
            const varName = varRef.match(/var\((--[^)]+)\)/)?.[1];
            if (varName) {
              const value = computed.getPropertyValue(varName);
              if (value) addColor(value);
            }
          });
        }
      });

      // Sort by frequency and return top colors
      return Object.fromEntries(
        Array.from(colors.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 50)
          .map(([color, _count]) => [color, color])
      );
    });
  }

  private async extractEffects(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const shadows = new Set<string>();
      const transitions = new Set<string>();
      const transforms = new Set<string>();

      document.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);

        if (computed.boxShadow && computed.boxShadow !== 'none') {
          shadows.add(computed.boxShadow);
        }

        if (computed.transition && computed.transition !== 'none') {
          transitions.add(computed.transition);
        }

        if (computed.transform && computed.transform !== 'none') {
          transforms.add(computed.transform);
        }
      });

      return {
        shadows: Array.from(shadows),
        transitions: Array.from(transitions),
        transforms: Array.from(transforms),
      };
    });
  }

  private async extractBorderRadius(page: Page): Promise<Set<string>> {
    return await page.evaluate(() => {
      const _radii = new Set<string>();

      document.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.borderRadius && computed.borderRadius !== '0px') {
          _radii.add(computed.borderRadius);
        }
      });

      return _radii;
    });
  }

  private async detectUIPatterns(page: Page): Promise<UIPattern[]> {
    console.log('🔍 Detecting UI patterns with advanced analysis...');
    return await this.patternDetector.detectPatterns(page);
  }

  private async extractMicroInteractions(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const nav = document.querySelector(
        'nav, [role="navigation"], header nav, .navbar, .nav-menu'
      );
      if (!nav) return null;

      const rect = nav.getBoundingClientRect();
      const computed = window.getComputedStyle(nav);
      const links = nav.querySelectorAll('a, [role="link"]');

      return {
        type: 'navigation',
        selector: nav.tagName.toLowerCase(),
        confidence: 0.95,
        properties: {
          position: computed.position,
          layout: computed.display,
          height: rect.height,
          itemCount: links.length,
          hasSearch: !!nav.querySelector('input[type="search"], .search'),
          hasUserMenu: !!nav.querySelector('.user-menu, .avatar, [aria-label*="user"]'),
          isSticky: computed.position === 'sticky' || computed.position === 'fixed',
        },
        accessibility: {
          hasAriaLabel: nav.hasAttribute('aria-label'),
          keyboardNavigable: true,
          hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
        },
      };
    });
  }

  private async _detectHeroPattern(page: Page): Promise<UIPattern | null> {
    return await page.evaluate(() => {
      const hero = document.querySelector('.hero, [class*="hero"], section:first-of-type h1');
      if (!hero) return null;

      const section = hero.closest('section') || hero.parentElement;
      if (!section) return null;

      const hasHeading = !!section.querySelector('h1, h2');
      const hasSubheading = !!section.querySelector('p, .subtitle, .subheading');
      const hasCTA = !!section.querySelector('button, a.btn, [class*="button"]');
      const hasImage = !!section.querySelector('img, video, svg');

      return {
        type: 'hero',
        variant: 'standard',
        selector: '.hero',
        confidence: 0.85,
        properties: {
          layout: hasImage ? 'split' : 'centered',
          hasHeading,
          hasSubheading,
          hasCTA,
          hasImage,
          height: section.getBoundingClientRect().height,
        },
        accessibility: {
          headingLevel: section.querySelector('h1') ? 1 : 2,
          altTexts: hasImage,
        },
        content: {
          headings: hasHeading ? ['Hero heading'] : [],
          text: hasSubheading ? 'Hero subheading text' : '',
          links: hasCTA ? ['Call to action'] : [],
          images: hasImage ? ['Hero image'] : [],
        },
      };
    });
  }

  private async _detectCardPattern(page: Page): Promise<UIPattern | null> {
    return await page.evaluate(() => {
      const cards = document.querySelectorAll('.card, [class*="card"], article');
      if (cards.length < 2) return null;

      const parent = cards[0].parentElement;
      if (!parent) return null;

      const computed = window.getComputedStyle(parent);

      return {
        type: 'cards',
        variant: 'standard',
        selector: '.card',
        confidence: 0.9,
        properties: {
          count: cards.length,
          layout: computed.display,
          columns: computed.gridTemplateColumns || 'auto',
          gap: computed.gap,
          hasImages: !!cards[0]?.querySelector('img'),
          hasActions: !!cards[0]?.querySelector('button, a'),
        },
        accessibility: {
          semanticHTML: cards[0]?.tagName === 'ARTICLE',
          hasHeadings: !!cards[0]?.querySelector('h1, h2, h3, h4, h5, h6'),
        },
        content: {
          headings: cards[0]?.querySelector('h1, h2, h3, h4, h5, h6') ? ['Card heading'] : [],
          text: 'Card content text',
          links: cards[0]?.querySelector('button, a') ? ['Card action'] : [],
          images: cards[0]?.querySelector('img') ? ['Card image'] : [],
        },
      };
    });
  }

  private async _detectFormPattern(page: Page): Promise<UIPattern | null> {
    return await page.evaluate(() => {
      const form = document.querySelector('form');
      if (!form) return null;

      const inputs = form.querySelectorAll('input, textarea, select');
      const labels = form.querySelectorAll('label');
      const buttons = form.querySelectorAll('button, input[type="submit"]');

      return {
        type: 'form',
        variant: 'standard',
        selector: 'form',
        confidence: 0.95,
        properties: {
          fieldCount: inputs.length,
          hasLabels: labels.length > 0,
          hasValidation: !!form.querySelector('[required], [pattern]'),
          hasHelperText: !!form.querySelector('.helper-text, .hint, small'),
          submitButtons: buttons.length,
          layout: 'vertical', // or 'horizontal' based on analysis
        },
        accessibility: {
          labelsConnected: labels.length === inputs.length,
          hasFieldsets: !!form.querySelector('fieldset'),
          hasErrorMessages: !!form.querySelector('[role="alert"], .error-message'),
        },
        content: {
          headings: form.querySelector('h1, h2, h3, h4, h5, h6') ? ['Form heading'] : [],
          text: 'Form with input fields',
          links: buttons.length > 0 ? ['Submit button'] : [],
          images: [],
        },
      };
    });
  }

  private async _detectTablePattern(page: Page): Promise<UIPattern | null> {
    return await page.evaluate(() => {
      const table = document.querySelector('table, [role="table"]');
      if (!table) return null;

      const headers = table.querySelectorAll('th, [role="columnheader"]');
      const rows = table.querySelectorAll('tr, [role="row"]');

      return {
        type: 'table',
        variant: 'standard',
        selector: 'table',
        confidence: 0.95,
        properties: {
          columns: headers.length,
          rows: rows.length,
          hasHeaders: headers.length > 0,
          hasSorting: !!table.querySelector('[aria-sort]'),
          hasFiltering: !!document.querySelector('input[placeholder*="filter"], .filter'),
          hasPagination: !!document.querySelector('.pagination, [aria-label="pagination"]'),
          hasActions: !!table.querySelector('button, a'),
        },
        accessibility: {
          hasCaption: !!table.querySelector('caption'),
          scopeAttributes: !!table.querySelector('th[scope]'),
          responsive: !!table.closest('.table-responsive, .overflow-x-auto'),
        },
        content: {
          headings: headers.length > 0 ? ['Table headers'] : [],
          text: 'Tabular data content',
          links: table.querySelector('button, a') ? ['Table actions'] : [],
          images: [],
        },
      };
    });
  }

  private async extractMicroInteractions(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const interactions: any = {
        hover: [],
        focus: [],
        active: [],
        transitions: [],
      };

      // Sample interactive elements
      const interactiveElements = document.querySelectorAll(
        'button, a, input, .card, [role="button"], [tabindex="0"]'
      );

      interactiveElements.forEach(el => {
        const computed = window.getComputedStyle(el);

        // Check for transitions
        if (computed.transition && computed.transition !== 'none') {
          interactions.transitions.push({
            selector: el.tagName.toLowerCase(),
            transition: computed.transition,
            duration: computed.transitionDuration,
            timing: computed.transitionTimingFunction,
          });
        }

        // Note: Actual hover/focus states would need to be triggered
        // This is a simplified version
        if (computed.cursor === 'pointer') {
          interactions.hover.push({
            selector: el.tagName.toLowerCase(),
            cursor: 'pointer',
          });
        }
      });

      return interactions;
    });
  }

  private async calculateQualityScore(
    tokens: DesignTokens,
    patterns: UIPattern[]
  ): Promise<QualityScore> {
    console.log('📊 Calculating S-Tier quality score...');
    return this.qualityScorer.calculateScore(tokens, patterns);
  }

  private _scoreColorConsistency(_colors: any): number {
    // Analyze color palette for consistency
    // Check for semantic color usage
    // Verify color relationships
    return 0.88; // Placeholder - implement actual scoring
  }

  private _scoreTypographyHierarchy(_typography: any): number {
    // Check for clear hierarchy
    // Verify modular scale usage
    // Check line height optimization
    return 0.92; // Placeholder
  }

  private _scoreSpacingRegularity(_spacing: any): number {
    // Check if spacing follows a consistent scale
    // Verify adherence to base unit (8px)
    return 0.85; // Placeholder
  }

  private async _scoreAccessibility(_tokens: DesignTokens): Promise<number> {
    // Check color contrast ratios
    // Verify font sizes meet minimums
    // Check focus states exist
    return 0.9; // Placeholder
  }

  private _scorePatternConsistency(_patterns: UIPattern[]): number {
    // Check if patterns follow consistent structure
    // Verify accessibility features
    return 0.87; // Placeholder
  }

  private _scoreModernity(_tokens: DesignTokens, _patterns: UIPattern[]): number {
    // Check for modern CSS features
    // Verify contemporary design patterns
    // Check animation usage
    return 0.91; // Placeholder
  }

  private _normalizeColors(_colors: Map<string, string>): any {
    // Group colors by similarity
    // Identify semantic roles
    // Create normalized palette
    const normalized: any = {
      primary: {},
      neutral: {},
      semantic: {},
      accent: {},
    };

    // Simplified normalization - would use color theory algorithms
    // This is placeholder logic - real implementation would:
    // 1. Convert to HSL for better grouping
    // 2. Identify color relationships
    // 3. Assign semantic meanings

    return normalized;
  }

  private _normalizeTypography(typography: any): any {
    // Normalize to modular scale
    // Ensure consistent line heights
    // Standardize font weights
    return typography; // Placeholder
  }

  private _normalizeSpacing(spacing: number[]): any {
    // Find base unit (likely 4px or 8px)
    // Group into scale
    const baseUnit = this.findBaseUnit(spacing);
    const scale = this.createSpacingScale(spacing, baseUnit);

    return {
      baseUnit,
      scale,
    };
  }

  private findBaseUnit(values: number[]): number {
    // Find GCD of all spacing values
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const findGCD = (arr: number[]): number => arr.reduce(gcd);

    const commonUnit = findGCD(values.filter(v => v > 0 && v <= 64));

    // Prefer 4px or 8px if they're close
    if (commonUnit >= 3 && commonUnit <= 5) return 4;
    if (commonUnit >= 6 && commonUnit <= 10) return 8;

    return commonUnit || 8;
  }

  private createSpacingScale(values: number[], baseUnit: number): number[] {
    const scale = new Set<number>();

    values.forEach(value => {
      const multiple = Math.round(value / baseUnit);
      if (multiple > 0 && multiple <= 20) {
        scale.add(multiple * baseUnit);
      }
    });

    return Array.from(scale).sort((a, b) => a - b);
  }

  private normalizeEffects(effects: any): any {
    // Categorize shadows (sm, md, lg, xl)
    // Normalize transitions
    // Standardize transforms
    return effects; // Placeholder
  }

  private normalizeBorderRadius(_radii: Set<string>): any {
    const normalized = {
      small: '4px',
      medium: '8px',
      large: '16px',
      full: '9999px',
    };

    // Group radii into categories
    // Real implementation would analyze and categorize

    return normalized;
  }

  private generateRecommendations(tokens: DesignTokens, quality: QualityScore): string[] {
    const recommendations: string[] = [];

    // Analyze quality scores and generate specific recommendations
    if (quality.breakdown.colorConsistency < 0.8) {
      recommendations.push('Consider reducing color palette complexity for better consistency');
    }

    if (quality.breakdown.spacingRegularity < 0.8) {
      recommendations.push('Standardize spacing to follow an 8px grid system');
    }

    if (quality.breakdown.accessibilityCompliance < 0.9) {
      recommendations.push('Improve color contrast ratios to meet WCAG AA standards');
    }

    if (quality.breakdown.typographyHierarchy < 0.85) {
      recommendations.push('Establish clearer typographic hierarchy using a modular scale');
    }

    return recommendations;
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Export for CLI usage
export default StyleExtractor;
