#!/usr/bin/env node

// scripts/compose-spec.ts
import { ColorNormalizer } from '../extractors/playwright/utils/color-normalizer';
import { ComponentSpec, UIPattern, DesignTokens } from '../extractors/schemas/style.schema';
import { UnifiedSpec } from '../extractors/schemas/spec.schema';
import { BrandProfile } from '../extractors/schemas/brand.schema';
import * as fs from 'fs/promises';
import * as path from 'path';

export class SpecComposer {
  // Utility class instances for enhanced composition
  private colorNormalizer: ColorNormalizer;

  constructor() {
    // Initialize utility classes
    this.colorNormalizer = new ColorNormalizer();
  }

  private readonly COMPONENT_MAPPINGS = {
    navigation: {
      componentName: 'Navigation',
      requiredProps: ['items', 'logo', 'variant'],
      defaultVariants: ['desktop', 'mobile', 'sticky'],
    },
    hero: {
      componentName: 'HeroSection',
      requiredProps: ['title', 'subtitle', 'cta'],
      defaultVariants: ['centered', 'split', 'background-image'],
    },
    cards: {
      componentName: 'CardGrid',
      requiredProps: ['cards', 'columns', 'gap'],
      defaultVariants: ['grid', 'masonry', 'carousel'],
    },
    form: {
      componentName: 'FormComponent',
      requiredProps: ['fields', 'submitHandler', 'validation'],
      defaultVariants: ['inline', 'stacked', 'multi-step'],
    },
    table: {
      componentName: 'DataTable',
      requiredProps: ['columns', 'data', 'pagination'],
      defaultVariants: ['sortable', 'filterable', 'responsive'],
    },
    footer: {
      componentName: 'Footer',
      requiredProps: ['sections', 'copyright', 'social'],
      defaultVariants: ['columns', 'centered', 'minimal'],
    },
  };

  async compose(
    styleExtractionPath: string,
    brandExtractionPath: string,
    outputPath: string
  ): Promise<UnifiedSpec> {
    console.log('🎯 Starting spec composition...');

    // Load extraction results
    const styleData = await this.loadStyleExtraction(styleExtractionPath);
    const brandData = await this.loadBrandExtraction(brandExtractionPath);

    // Merge and enhance tokens
    const enhancedTokens = await this.enhanceDesignTokens(styleData['tokens'], brandData);

    // Generate component specifications
    const componentSpecs = this.generateComponentSpecs(
      styleData['patterns'],
      brandData.contentInventory || []
    );

    // Apply S-tier standards
    const validatedTokens = this.applySTierStandards(enhancedTokens);

    // Create unified specification
    const spec: UnifiedSpec = {
      version: '1.0',
      source: {
        styleUrl: styleData['url'],
        brandUrl: brandData.url || '',
        extractedAt: new Date().toISOString(),
        extractorVersion: '1.0.0',
      },
      design: {
        tokens: validatedTokens,
        patterns: (styleData['patterns'] || []) as any,
        quality: styleData['qualityScore'],
      },
      brand: {
        profile: brandData,
        content: brandData.contentInventory || [],
        architecture: brandData.informationArchitecture || {},
        seo: brandData.seoMetadata || {},
        messaging: brandData.messaging || {},
      },
      architecture: brandData.informationArchitecture || {},
      generation: {
        framework: 'nextjs',
        styling: 'tailwind',
        components: {},
        pages: [],
        assets: {
          images: [],
          fonts: [],
          icons: [],
        },
        build: {
          output: './output',
          publicPath: '/',
          optimization: {
            minify: true,
            compress: true,
            preload: true,
          },
        },
      },
      validation: {
        accessibility: {
          wcagLevel: 'AA',
          minScore: 0.95,
          automated: true,
        },
        performance: {
          lighthouse: {
            performance: 90,
            accessibility: 95,
            bestPractices: 90,
            seo: 90,
            pwa: 50,
          },
          metrics: {
            fcp: 1800,
            lcp: 2500,
            tti: 3800,
            tbt: 300,
            cls: 0.1,
            speedIndex: 3400,
          },
        },
        seo: {
          score: 90,
          checks: ['meta-tags', 'structured-data', 'canonical-urls'],
        },
        responsive: {
          breakpoints: ['375px', '768px', '1024px', '1440px'],
          devices: ['mobile', 'tablet', 'desktop'],
        },
      },
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        author: 'Web Style Transfer',
        license: 'MIT',
      },
    };

    // Save specification
    await this.saveSpec(spec, outputPath);

    console.log('✅ Spec composition complete!');
    console.log(`📊 Generated ${componentSpecs.length} component specifications`);
    console.log(`🎨 Quality score: ${styleData['qualityScore']?.overall?.toFixed(2) || 'N/A'}/1.0`);

    return spec;
  }

  private async loadStyleExtraction(path: string): Promise<DesignTokens> {
    const content = await fs.readFile(path, 'utf-8');
    return JSON.parse(content);
  }

  private async loadBrandExtraction(path: string): Promise<any> {
    const content = await fs.readFile(path, 'utf-8');
    return JSON.parse(content);
  }

  private async enhanceDesignTokens(
    tokens: DesignTokens,
    brand: BrandProfile
  ): Promise<DesignTokens> {
    console.log('🎨 Enhancing design tokens with advanced processing...');

    // Use ColorNormalizer for sophisticated color processing
    const rawColors = this.extractColorsFromTokens(tokens);
    const normalizedColors = this.colorNormalizer.normalizeColors(rawColors);

    // Enhance colors with brand information
    if (brand.themeColor) {
      // Add brand color as primary if not already present
      const brandColors = [brand.themeColor];
      const brandColorSystem = this.colorNormalizer.normalizeColors(brandColors);

      // Merge brand colors with existing colors
      tokens.colors = this.mergeColorSystems(tokens.colors, normalizedColors, brandColorSystem);
    } else {
      tokens.colors = this.convertToDesignTokens(normalizedColors);
    }

    // Ensure semantic color roles
    this.ensureSemanticColors(tokens.colors);

    // Apply S-tier quality enhancements
    tokens = this.applyQualityEnhancements(tokens);

    return tokens;
  }

  // Helper methods for enhanced token processing
  private extractColorsFromTokens(tokens: DesignTokens): string[] {
    const colors: string[] = [];

    // Extract colors from color tokens
    if (tokens.colors) {
      Object.values(tokens.colors).forEach(colorGroup => {
        if (typeof colorGroup === 'object' && colorGroup !== null) {
          Object.values(colorGroup).forEach(colorToken => {
            if (colorToken && typeof colorToken === 'object' && '$value' in colorToken) {
              colors.push(colorToken.$value as string);
            }
          });
        }
      });
    }

    return colors;
  }

  private mergeColorSystems(existing: any, normalized: any, brand: any): any {
    // Merge existing colors with normalized and brand colors
    const merged = { ...existing };

    // Add normalized colors if they don't exist
    if (normalized.tokens) {
      Object.entries(normalized.tokens).forEach(([key, token]) => {
        if (!merged[key]) {
          merged[key] = token;
        }
      });
    }

    // Add brand colors as primary
    if (brand.tokens && Object.keys(brand.tokens).length > 0) {
      merged.primary = merged.primary || {};
      merged.primary.brand = Object.values(brand.tokens)[0];
    }

    return merged;
  }

  private convertToDesignTokens(colorSystem: any): any {
    return colorSystem.tokens || {};
  }

  private applyQualityEnhancements(tokens: DesignTokens): DesignTokens {
    // Apply S-tier quality enhancements
    const enhanced = { ...tokens };

    // Ensure minimum contrast ratios
    if (enhanced.colors) {
      enhanced.colors = this.ensureColorContrast(enhanced.colors);
    }

    // Optimize spacing for 8px grid
    if (enhanced.spacing) {
      enhanced.spacing = this.optimizeSpacingGrid(enhanced.spacing);
    }

    // Ensure typography accessibility
    if (enhanced.typography) {
      enhanced.typography = this.ensureTypographyAccessibility(enhanced.typography);
    }

    return enhanced;
  }

  private ensureColorContrast(colors: any): any {
    // Ensure all color combinations meet WCAG AA standards
    // This is a simplified implementation - would need actual contrast calculation
    const enhanced = { ...colors };

    // Ensure semantic colors have good contrast
    if (!enhanced.semantic) {
      enhanced.semantic = {};
    }

    // Add high-contrast semantic colors if missing
    const semanticDefaults = {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    };

    Object.entries(semanticDefaults).forEach(([key, value]) => {
      if (!enhanced.semantic[key]) {
        enhanced.semantic[key] = {
          $value: value,
          $type: 'color',
          usage: 'semantic',
        };
      }
    });

    return enhanced;
  }

  private optimizeSpacingGrid(spacing: any): any {
    // Normalize spacing to 8px grid
    const enhanced = { ...spacing };
    const baseUnit = 8;

    // Ensure common spacing values are multiples of 8
    const commonValues = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];

    commonValues.forEach(value => {
      const numericValue = parseInt(value);
      const gridValue = Math.round(numericValue / baseUnit) * baseUnit;

      if (!enhanced[value] && gridValue > 0) {
        enhanced[value] = `${gridValue}px`;
      }
    });

    return enhanced;
  }

  private ensureTypographyAccessibility(typography: any): any {
    const enhanced = { ...typography };

    // Ensure minimum font sizes
    if (enhanced.scale) {
      Object.entries(enhanced.scale).forEach(([key, value]: [string, any]) => {
        if (value && value.size) {
          const fontSize = parseFloat(value.size);
          if (fontSize < 14) {
            enhanced.scale[key].size = '14px';
          }
        }
      });
    }

    // Ensure line heights are adequate
    if (enhanced.scale) {
      Object.entries(enhanced.scale).forEach(([key, value]: [string, any]) => {
        if (value && !value.lineHeight) {
          const fontSize = parseFloat(value.size || '16px');
          const lineHeight = fontSize < 18 ? 1.5 : 1.6;
          enhanced.scale[key].lineHeight = lineHeight.toString();
        }
      });
    }

    return enhanced;
  }

  private ensureSemanticColors(colors: any): void {
    // Ensure all semantic colors exist
    const semanticDefaults = {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    };

    colors.semantic = colors.semantic || {};

    Object.entries(semanticDefaults).forEach(([key, value]) => {
      if (!colors.semantic[key]) {
        colors.semantic[key] = {
          $value: value,
          $type: 'color',
          usage: 'semantic',
        };
      }
    });

    // Ensure neutral scale
    if (!colors.neutral || Object.keys(colors.neutral).length < 5) {
      // Generate basic neutral scale
      colors.neutral = {
        50: { $value: '#fafafa', $type: 'color', usage: 'neutral' },
        100: { $value: '#f5f5f5', $type: 'color', usage: 'neutral' },
        200: { $value: '#e5e5e5', $type: 'color', usage: 'neutral' },
        300: { $value: '#d4d4d4', $type: 'color', usage: 'neutral' },
        400: { $value: '#a3a3a3', $type: 'color', usage: 'neutral' },
        500: { $value: '#737373', $type: 'color', usage: 'neutral' },
        600: { $value: '#525252', $type: 'color', usage: 'neutral' },
        700: { $value: '#404040', $type: 'color', usage: 'neutral' },
        800: { $value: '#262626', $type: 'color', usage: 'neutral' },
        900: { $value: '#171717', $type: 'color', usage: 'neutral' },
      };
    }
  }

  private generateComponentSpecs(patterns: UIPattern[], content: any): ComponentSpec[] {
    const specs: ComponentSpec[] = [];

    patterns.forEach(pattern => {
      const mapping = this.COMPONENT_MAPPINGS[pattern.type as keyof typeof this.COMPONENT_MAPPINGS];
      if (!mapping) return;

      const spec: ComponentSpec = {
        name: mapping.componentName,
        type: pattern.type as ComponentSpec['type'],
        pattern: pattern,
        props: this.extractPropsFromPattern(pattern, mapping.requiredProps),
        variants: mapping.defaultVariants.map((variant: string) => ({
          name: variant,
          props: {},
          styles: {},
        })),
        content: this.extractContentForComponent(pattern.type, content),
        styles: {},
        accessibility: {
          roles: [],
          labels: [],
          keyboard: [],
          screenReader: [],
        },
        responsive: {
          breakpoints: [],
          behaviors: {},
        },
      };

      specs.push(spec);
    });

    // Add essential components even if not detected
    this.ensureEssentialComponents(specs);

    return specs;
  }

  private extractPropsFromPattern(
    pattern: UIPattern,
    requiredProps: string[]
  ): Record<string, any> {
    const props: Record<string, any> = {};

    requiredProps.forEach(prop => {
      // Extract prop values from pattern properties
      if ((pattern.properties as any)[prop]) {
        (props as any)[prop] = (pattern.properties as any)[prop];
      } else {
        // Set sensible defaults
        props[prop] = this.getDefaultPropValue(prop);
      }
    });

    return props;
  }

  private getDefaultPropValue(prop: string): any {
    const defaults: Record<string, any> = {
      items: [],
      logo: { src: '/logo.svg', alt: 'Logo' },
      variant: 'default',
      title: 'Title',
      subtitle: 'Subtitle',
      cta: { text: 'Get Started', href: '#' },
      cards: [],
      columns: 3,
      gap: '24px',
      fields: [],
      submitHandler: 'handleSubmit',
      validation: {},
      data: [],
      pagination: { pageSize: 10 },
      sections: [],
      copyright: '© 2024 Company Name',
      social: [],
    };

    return defaults[prop] || null;
  }

  private extractContentForComponent(type: string, contentInventory: any): any {
    // Extract relevant content for each component type
    switch (type) {
      case 'navigation':
        return contentInventory.pages.map((page: any) => ({
          label: page.title,
          href: page.url,
        }));

      case 'hero': {
        const heroPage = contentInventory.pages.find((p: any) => p.url === '/');
        return heroPage?.content.headings.h1?.[0] || null;
      }

      case 'cards':
        // Extract feature cards or similar content
        return contentInventory.pages
          .filter((p: any) => p.url.includes('feature') || p.url.includes('service'))
          .slice(0, 6);

      default:
        return null;
    }
  }

  private ensureEssentialComponents(specs: ComponentSpec[]): void {
    const essentialTypes = ['navigation', 'footer', 'hero'];

    essentialTypes.forEach(type => {
      if (!specs.find(s => s.type === type)) {
        const mapping = this.COMPONENT_MAPPINGS[type as keyof typeof this.COMPONENT_MAPPINGS];
        if (!mapping) return;

        specs.push({
          name: mapping.componentName,
          type: type as ComponentSpec['type'],
          pattern: this.createDefaultPattern(type),
          props: mapping.requiredProps.reduce(
            (acc, prop) => {
              acc[prop] = this.getDefaultPropValue(prop);
              return acc;
            },
            {} as Record<string, any>
          ),
          variants: mapping.defaultVariants.map((variant: string) => ({
            name: variant,
            props: {},
            styles: {},
          })),
          content: null,
          styles: {},
          accessibility: {
            roles: [],
            labels: [],
            keyboard: [],
            screenReader: [],
          },
          responsive: {
            breakpoints: [],
            behaviors: {},
          },
        });
      }
    });
  }

  private createDefaultPattern(type: string): UIPattern {
    return {
      type: type as any,
      variant: 'default',
      selector: `.${type}`,
      confidence: 0.5,
      properties: {},
      accessibility: {
        keyboardNavigable: true,
        hasAriaLabels: true,
        hasRoles: true,
        semanticHTML: true,
      },
      content: {
        headings: [],
        text: '',
        links: [],
        images: [],
      },
    };
  }

  private applySTierStandards(tokens: DesignTokens): DesignTokens {
    // Validate and fix color contrast
    this.validateColorContrast(tokens.colors);

    // Ensure minimum font sizes for accessibility
    this.enforceMinimumFontSizes(tokens.typography);

    // Validate spacing scale
    this.validateSpacingScale(tokens.spacing);

    // Add focus states if missing
    this.ensureFocusStates(tokens);

    return tokens;
  }

  private validateColorContrast(colors: any): void {
    // This would use a proper color contrast calculation
    // For now, we'll ensure semantic colors have good contrast

    // Ensure text colors have sufficient contrast
    if (!colors.neutral?.[900]) {
      colors.neutral = colors.neutral || {};
      colors.neutral[900] = {
        $value: '#0F172A',
        $type: 'color',
        usage: 'neutral',
      };
    }
  }

  private enforceMinimumFontSizes(typography: any): void {
    // Ensure body text is at least 14px
    if (typography.body?.fontSize) {
      const size = parseFloat(typography.body.fontSize.$value);
      if (size < 14) {
        typography.body.fontSize.$value = '14px';
      }
    }

    // Ensure small text is at least 12px
    if (typography.small?.fontSize) {
      const size = parseFloat(typography.small.fontSize.$value);
      if (size < 12) {
        typography.small.fontSize.$value = '12px';
      }
    }
  }

  private validateSpacingScale(spacing: any): void {
    // Ensure spacing follows 8px grid
    if (spacing.scale && typeof spacing.scale === 'object') {
      // For object-based spacing scales, validate each value
      Object.keys(spacing.scale).forEach(key => {
        const value = spacing.scale[key];
        if (typeof value === 'number') {
          const rounded = Math.round(value / 8) * 8;
          spacing.scale[key] = rounded || 8;
        }
      });
    }
  }

  private ensureFocusStates(tokens: DesignTokens): void {
    // Add focus ring tokens if not present
    if (!tokens.effects) {
      tokens.effects = {
        shadows: {},
        transitions: {},
      };
    }

    if (tokens.effects?.shadows) {
      tokens.effects.shadows['focus'] = '0 0 0 3px rgba(59, 130, 246, 0.5)';
    }
    if (tokens.effects?.transitions) {
      tokens.effects.transitions['focus'] = 'box-shadow 0.2s ease-in-out';
    }
  }

  private async saveSpec(spec: UnifiedSpec, outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    const content = JSON.stringify(spec, null, 2);
    await fs.writeFile(outputPath, content, 'utf-8');

    console.log(`📁 Specification saved to: ${outputPath}`);
  }
}

// CLI Interface using Commander.js
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('compose-spec')
  .description('Merge style and brand extractions into unified S-tier specification')
  .version('1.0.0')
  .argument('<style-path>', 'Path to style extraction JSON file')
  .argument('<brand-path>', 'Path to brand extraction JSON file')
  .option('-o, --output <path>', 'Output specification path', 'specs/composed/build-spec.json')
  .option(
    '--use-extract-defaults',
    'Use default extract paths: extract/style/styling.json and extract/brand/branding.json',
    false
  )
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--validate-input', 'Validate input files before processing', true)
  .option('--no-validate-input', 'Skip input validation')
  .action(async (stylePath: string, brandPath: string, options: any) => {
    try {
      // Use extract defaults if flag is set
      if (options.useExtractDefaults) {
        stylePath = 'extract/style/styling.json';
        brandPath = 'extract/brand/branding.json';
      }

      console.log(chalk.blue(`🎯 Starting spec composition:`));
      console.log(chalk.gray(`   Style extraction: ${stylePath}`));
      console.log(chalk.gray(`   Brand extraction: ${brandPath}`));
      console.log(chalk.gray(`   Output: ${options.output}`));

      // Validate input files if requested
      if (options.validateInput) {
        console.log(chalk.gray('🔍 Validating input files...'));

        try {
          await fs.access(stylePath);
        } catch {
          console.error(chalk.red(`❌ Style extraction file not found: ${stylePath}`));
          process.exit(1);
        }

        try {
          await fs.access(brandPath);
        } catch {
          console.error(chalk.red(`❌ Brand extraction file not found: ${brandPath}`));
          process.exit(1);
        }
      }

      // Initialize composer
      const composer = new SpecComposer();

      // Perform composition
      console.log(chalk.gray('🔄 Composing specifications...'));
      const spec = await composer.compose(stylePath, brandPath, options.output);

      // Display results
      console.log('');
      console.log(chalk.green(`✅ Spec composition complete!`));
      console.log(chalk.gray(`📁 Specification saved to: ${options.output}`));

      if (options.verbose) {
        console.log('');
        console.log(chalk.bold('📊 Composition Summary:'));
        console.log(
          chalk.gray(
            `   Design tokens merged: ${Object.keys(spec.design?.tokens || {}).length} categories`
          )
        );
        console.log(
          chalk.gray(`   Quality score: ${spec.design?.quality?.overall?.toFixed(2) || 'N/A'}`)
        );
        console.log(chalk.gray(`   Brand profile: ${spec.brand?.profile?.name || 'Extracted'}`));
        console.log(chalk.gray(`   Pages analyzed: ${spec.brand?.content?.pages?.length || 0}`));
        console.log(chalk.gray(`   S-tier standards applied: ✅`));
      }

      console.log('');
      console.log(chalk.green(`🎉 Unified specification ready for site generation!`));
    } catch (error) {
      console.error(chalk.red('❌ Spec composition failed:'), error);
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText(
  'after',
  `
Examples:
  $ compose-spec extract/style/styling.json extract/brand/branding.json
  $ compose-spec --use-extract-defaults
  $ compose-spec specs/tokens/design-tokens.json specs/content/site-content.json --output ./custom/build-spec.json --verbose
  $ compose-spec extract/style/styling.json extract/brand/branding.json --no-validate-input
`
);

program.parse(process.argv);

export default SpecComposer;
