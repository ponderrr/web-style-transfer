#!/usr/bin/env node

import { z } from 'zod';
import * as fs from 'fs/promises';
import chalk from 'chalk';

// Zod schemas for validation

// Basic token validation - commented out as not currently used
// const BasicTokenSchema = z.object({
//   $value: z.union([z.string(), z.number()]),
//   $type: z.string(),
//   $description: z.string().optional(),
// });

// Color contrast requirements
const ColorContrastSchema = z.object({
  normalText: z.object({
    aa: z.number(),
    aaa: z.number(),
  }),
  largeText: z.object({
    aa: z.number(),
    aaa: z.number(),
  }),
  uiComponents: z.object({
    minimum: z.number(),
    preferred: z.number(),
  }),
  focusIndicators: z.object({
    minimum: z.number(),
    preferred: z.number(),
  }),
  nonTextContent: z.object({
    minimum: z.number(),
    preferred: z.number(),
  }),
});

// Typography scale validation
const TypographyScaleSchema = z.object({
  modular: z.object({
    ratio: z.number(),
    values: z.record(z.string(), z.number()),
  }),
  heading: z.object({
    ratio: z.number(),
    values: z.record(z.string(), z.number()),
  }),
  smallText: z.object({
    values: z.record(z.string(), z.number()),
  }),
  lineHeight: z.object({
    min: z.number(),
    max: z.number(),
    optimal: z.number(),
  }),
});

// Performance budget validation
const PerformanceBudgetSchema = z.object({
  firstContentfulPaint: z.object({
    target: z.number(),
    warning: z.number(),
    failure: z.number(),
  }),
  largestContentfulPaint: z.object({
    target: z.number(),
    warning: z.number(),
    failure: z.number(),
  }),
  cumulativeLayoutShift: z.object({
    target: z.number(),
    warning: z.number(),
    failure: z.number(),
  }),
  totalBlockingTime: z.object({
    target: z.number(),
    warning: z.number(),
    failure: z.number(),
  }),
  bundleSize: z.object({
    target: z.number(),
    warning: z.number(),
    failure: z.number(),
  }),
  speedIndex: z.object({
    target: z.number(),
    warning: z.number(),
    failure: z.number(),
  }),
});

// Component validation
const ComponentSpecSchema = z.object({
  name: z.string(),
  type: z.enum(['atom', 'molecule', 'organism', 'template', 'page']),
  variants: z.array(
    z.object({
      name: z.string(),
      props: z.record(z.any()),
      styles: z.record(z.string(), z.any()),
      accessibility: z
        .object({
          roles: z.array(z.string()).optional(),
          labels: z.array(z.string()).optional(),
          keyboard: z.array(z.string()).optional(),
          screenReader: z.array(z.string()).optional(),
        })
        .optional(),
    })
  ),
  props: z.record(z.any()),
  styles: z.record(z.any()),
  accessibility: z.object({
    roles: z.array(z.string()).optional(),
    labels: z.array(z.string()).optional(),
    keyboard: z.array(z.string()).optional(),
    screenReader: z.array(z.string()).optional(),
  }),
  responsive: z.object({
    breakpoints: z.array(z.string()),
    behaviors: z.record(z.string(), z.string()),
  }),
});

// UnifiedSpec validation (simplified version)
const UnifiedSpecSchema = z.object({
  version: z.string(),
  source: z.object({
    styleUrl: z.string(),
    brandUrl: z.string(),
    extractedAt: z.string(),
    extractorVersion: z.string().optional(),
    qualityScores: z
      .object({
        style: z.number(),
        brand: z.number(),
        overall: z.number(),
      })
      .optional(),
  }),
  design: z.object({
    tokens: z.record(z.any()),
    patterns: z.array(z.any()),
    quality: z.object({
      overall: z.number(),
      breakdown: z.record(z.string(), z.number()),
      recommendations: z.array(z.string()),
    }),
  }),
  brand: z.object({
    profile: z.object({
      name: z.string(),
      tagline: z.string().optional(),
      logo: z
        .object({
          src: z.string(),
          alt: z.string(),
        })
        .optional(),
      voice: z.object({
        primary: z.string(),
        attributes: z.array(z.string()),
        formality: z.enum(['formal', 'neutral', 'casual']),
      }),
    }),
  }),
  generation: z.object({
    framework: z.enum(['nextjs', 'vite', 'astro', 'custom']),
    styling: z.enum(['tailwind', 'styled-components', 'css-modules', 'custom']),
    components: z.record(ComponentSpecSchema),
    pages: z.array(
      z.object({
        path: z.string(),
        name: z.string(),
        components: z.array(
          z.object({
            component: z.string(),
            variant: z.string().optional(),
            props: z.record(z.any()),
            position: z.object({
              row: z.number(),
              column: z.number(),
            }),
          })
        ),
        layout: z.object({
          type: z.string(),
          container: z.string().optional(),
        }),
      })
    ),
  }),
});

// S-Tier Principles validation
const STierPrinciplesSchema = z.object({
  version: z.string(),
  grid: z.object({
    baseUnit: z.number(),
    scaleMultipliers: z.array(z.number()),
    containerMaxWidth: z.number(),
    gutterSpacing: z.record(z.string(), z.number()),
  }),
  breakpoints: z.object({
    mobile: z.object({
      min: z.number(),
      max: z.number(),
      container: z.number(),
      columns: z.number(),
      gutter: z.number(),
    }),
    tablet: z.object({
      min: z.number(),
      max: z.number(),
      container: z.number(),
      columns: z.number(),
      gutter: z.number(),
    }),
    desktop: z.object({
      min: z.number(),
      max: z.number(),
      container: z.number(),
      columns: z.number(),
      gutter: z.number(),
    }),
    wide: z.object({
      min: z.number(),
      container: z.number(),
      columns: z.number(),
      gutter: z.number(),
    }),
  }),
  color: z.object({
    requirements: ColorContrastSchema,
    colorBlindness: z.object({
      avoidRedGreen: z.boolean(),
      addVisualCues: z.boolean(),
      testSimulators: z.boolean(),
      maintainContrast: z.boolean(),
    }),
  }),
  typography: z.object({
    scale: TypographyScaleSchema,
    fonts: z.object({
      primary: z.string(),
      secondary: z.string().optional(),
      monospace: z.string(),
      fallback: z.array(z.string()),
    }),
  }),
  motion: z.object({
    microInteractions: z.object({
      duration: z.number(),
      easing: z.string(),
      usage: z.array(z.string()),
    }),
    pageTransitions: z.object({
      duration: z.number(),
      easing: z.string(),
      usage: z.array(z.string()),
    }),
    loadingStates: z.object({
      duration: z.number(),
      easing: z.string(),
      usage: z.array(z.string()),
    }),
    entranceAnimations: z.object({
      duration: z.array(z.number()),
      easing: z.string(),
      usage: z.array(z.string()),
    }),
  }),
  performance: PerformanceBudgetSchema,
  responsive: z.object({
    breakpoints: z.any(), // Reference to main breakpoints
    fluidTypography: z.object({
      min: z.string(),
      max: z.string(),
      viewport: z.string(),
    }),
    containerQueries: z.object({
      small: z.string(),
      medium: z.string(),
      large: z.string(),
    }),
  }),
  components: z.object({
    button: z.object({
      variants: z.record(z.any()),
      spacing: z.record(z.any()),
    }),
    form: z.object({
      input: z.record(z.any()),
      label: z.record(z.any()),
      validation: z.record(z.any()),
    }),
    card: z.record(z.any()),
  }),
  accessibility: z.object({
    wcagLevel: z.enum(['A', 'AA', 'AAA']),
    checklist: z.record(z.any()),
    colorContrast: ColorContrastSchema,
    keyboardNavigation: z.record(z.any()),
    screenReader: z.record(z.any()),
  }),
  quality: z.object({
    metrics: z.record(z.any()),
    automatedChecks: z.record(z.any()),
  }),
  guidelines: z.object({
    dos: z.array(z.string()),
    donts: z.array(z.string()),
  }),
  checklists: z.record(z.any()),
});

// Validation functions
export class SchemaValidator {
  static async validateUnifiedSpec(
    filePath: string
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      const result = UnifiedSpecSchema.safeParse(data);

      if (result.success) {
        return { valid: true };
      } else {
        return {
          valid: false,
          errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to read or parse file: ${error}`],
      };
    }
  }

  static async validateSTierPrinciples(
    filePath: string
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      // Read the TypeScript file content to check basic structure
      const content = await fs.readFile(filePath, 'utf-8');

      // Basic validation checks for required exports and structure
      const checks = [
        content.includes('export const defaultSTierPrinciples'),
        content.includes('version:'),
        content.includes('grid:'),
        content.includes('breakpoints:'),
        content.includes('color:'),
        content.includes('typography:'),
        content.includes('motion:'),
        content.includes('performance:'),
        content.includes('guidelines:'),
        content.includes('checklists:'),
      ];

      const missingElements = [
        'defaultSTierPrinciples export',
        'version field',
        'grid configuration',
        'breakpoints',
        'color requirements',
        'typography scale',
        'motion definitions',
        'performance budget',
        'guidelines',
        'checklists',
      ].filter((_, index) => !checks[index]);

      if (missingElements.length === 0) {
        return { valid: true };
      } else {
        return {
          valid: false,
          errors: [`Missing required elements: ${missingElements.join(', ')}`],
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to read principles file: ${error}`],
      };
    }
  }

  static async validateAllSchemas(): Promise<{
    unifiedSpec: { valid: boolean; errors?: string[] };
    sTierPrinciples: { valid: boolean; errors?: string[] };
  }> {
    const [unifiedSpec, sTierPrinciples] = await Promise.all([
      this.validateUnifiedSpec('./specs/composed/build-spec.json'),
      this.validateSTierPrinciples('./extractors/schemas/s-tier-principles.ts'),
    ]);

    return {
      unifiedSpec,
      sTierPrinciples,
    };
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'unified-spec': {
      console.log(chalk.blue('🔍 Validating UnifiedSpec...'));
      const unifiedResult = await SchemaValidator.validateUnifiedSpec(
        './specs/composed/build-spec.json'
      );
      if (unifiedResult.valid) {
        console.log(chalk.green('✅ UnifiedSpec is valid'));
      } else {
        console.log(chalk.red('❌ UnifiedSpec validation failed:'));
        unifiedResult.errors?.forEach(error => console.log(chalk.red(`   ${error}`)));
      }
      break;
    }

    case 's-tier-principles': {
      console.log(chalk.blue('🔍 Validating S-Tier Principles...'));
      const principlesResult = await SchemaValidator.validateSTierPrinciples(
        './extractors/schemas/s-tier-principles.ts'
      );
      if (principlesResult.valid) {
        console.log(chalk.green('✅ S-Tier Principles are valid'));
      } else {
        console.log(chalk.red('❌ S-Tier Principles validation failed:'));
        principlesResult.errors?.forEach(error => console.log(chalk.red(`   ${error}`)));
      }
      break;
    }

    case 'all':
    default: {
      console.log(chalk.blue('🔍 Validating all schemas...'));
      const allResults = await SchemaValidator.validateAllSchemas();

      console.log(chalk.bold('\n📋 Validation Results:'));

      if (allResults.unifiedSpec.valid) {
        console.log(chalk.green('✅ UnifiedSpec: Valid'));
      } else {
        console.log(chalk.red('❌ UnifiedSpec: Invalid'));
        allResults.unifiedSpec.errors?.forEach(error => console.log(chalk.red(`   ${error}`)));
      }

      if (allResults.sTierPrinciples.valid) {
        console.log(chalk.green('✅ S-Tier Principles: Valid'));
      } else {
        console.log(chalk.red('❌ S-Tier Principles: Invalid'));
        allResults.sTierPrinciples.errors?.forEach(error => console.log(chalk.red(`   ${error}`)));
      }

      const overallValid = allResults.unifiedSpec.valid && allResults.sTierPrinciples.valid;
      if (overallValid) {
        console.log(chalk.green('\n🎉 All schemas are valid!'));
      } else {
        console.log(chalk.red('\n💥 Some schemas have validation errors.'));
        process.exit(1);
      }
      break;
    }
  }
}

// Export for use in other modules
export { UnifiedSpecSchema, STierPrinciplesSchema };

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Validation failed:'), error);
    process.exit(1);
  });
}
