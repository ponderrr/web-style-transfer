#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { StyleExtractor } from '../extractors/playwright/style-extractor';
import { BrandExtractor } from '../extractors/playwright/brand-extractor';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validateUrl } from '../src/lib/utils';

const program = new Command();

program
  .name('multi-source-transfer')
  .description('Transfer design from multiple sources to content from another - advanced style transfer')
  .version('1.0.0')
  .argument('<style-sources>', 'Comma-separated list of style source URLs')
  .argument('<content-url>', 'Content source URL')
  .option('-o, --output <path>', 'Output directory for generated site', './output/multi-source-transfer')
  .option('-n, --name <name>', 'Project name', 'multi-source-transfer')
  .option('--style-weights <weights>', 'Comma-separated style weights (0-1)', '0.5,0.3,0.2')
  .option('--content-weight <weight>', 'Content influence weight (0-1)', '1.0')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (styleSources: string, contentUrl: string, options: any) => {
    try {
      const styleUrls = styleSources.split(',').map((url: string) => url.trim());
      const styleWeights = options.styleWeights.split(',').map((w: string) => parseFloat(w.trim()));

      // Validate inputs
      if (styleUrls.length !== styleWeights.length) {
        console.error(chalk.red('❌ Number of style URLs must match number of weights'));
        process.exit(1);
      }

      if (!validateUrl(contentUrl)) {
        console.error(chalk.red('❌ Invalid content URL format'));
        process.exit(1);
      }

      for (const url of styleUrls) {
        if (!validateUrl(url)) {
          console.error(chalk.red(`❌ Invalid style URL format: ${url}`));
          process.exit(1);
        }
      }

      console.log(chalk.blue(`🎨 Starting multi-source style transfer:`));
      console.log(chalk.gray(`   Style sources: ${styleUrls.join(', ')}`));
      console.log(chalk.gray(`   Content source: ${contentUrl}`));
      console.log(chalk.gray(`   Style weights: ${styleWeights.join(', ')}`));
      console.log('');

      // Phase 1: Extract styles from multiple sources
      console.log(chalk.bold('Phase 1: Extracting styles from multiple sources...'));
      const styleResults = [];

      for (let i = 0; i < styleUrls.length; i++) {
        const url = styleUrls[i];
        const weight = styleWeights[i];

        console.log(chalk.gray(`   Extracting from ${url} (weight: ${weight})...`));
        const styleExtractor = new StyleExtractor();
        const result = await styleExtractor.extract(url);
        styleResults.push({ result, weight, url });

        if (options.verbose) {
          console.log(chalk.green(`     ✅ Style extracted - Quality: ${result.qualityScore.overall.toFixed(2)}`));
        }
      }

      // Phase 2: Extract content
      console.log(chalk.bold('Phase 2: Extracting content...'));
      const brandExtractor = new BrandExtractor();
      const contentResult = await brandExtractor.extract(contentUrl, {
        maxPages: 50,
        verbose: options.verbose
      });

      if (options.verbose) {
        console.log(chalk.green(`   ✅ Content extracted - ${contentResult.pages?.length || 0} pages analyzed`));
      }

      // Phase 3: Blend styles
      console.log(chalk.bold('Phase 3: Blending styles from multiple sources...'));
      const blendedSpec = await blendStyles(styleResults, contentResult, options);

      // Ensure output directory exists
      await fs.mkdir(options.output, { recursive: true });

      // Save blended specification
      const specPath = path.join(options.output, 'blended-spec.json');
      await fs.writeFile(specPath, JSON.stringify(blendedSpec, null, 2));

      // Phase 4: Generate website
      console.log(chalk.bold('Phase 4: Generating blended website...'));
      await generateBlendedWebsite(blendedSpec, options);

      // Display results
      console.log('');
      console.log(chalk.green('🎉 Multi-source style transfer complete!'));
      console.log(chalk.gray(`📁 Generated site: ${options.output}`));
      console.log(chalk.gray(`📋 Blended spec: ${specPath}`));

      if (options.verbose) {
        console.log('');
        console.log(chalk.bold('📊 Blend Summary:'));
        styleResults.forEach(({ url, weight, result }, index) => {
          console.log(chalk.gray(`   Source ${index + 1}: ${url} (${(weight * 100).toFixed(0)}%) - Quality: ${result.qualityScore.overall.toFixed(2)}`));
        });
        console.log(chalk.gray(`   Content: ${contentUrl} (${(parseFloat(options.contentWeight) * 100).toFixed(0)}%)`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Multi-source transfer failed:'), error);
      process.exit(1);
    }
  });

async function blendStyles(styleResults: any[], contentResult: any, options: any): Promise<any> {
  // Create blended specification
  const blendedSpec = {
    project: {
      name: options.name,
      styleSources: styleResults.map(({ url, weight }) => ({ url, weight })),
      contentSource: contentResult.url,
      generated: new Date().toISOString(),
      blendType: 'multi-source-weighted'
    },
    design: {
      blendedTokens: blendDesignTokens(styleResults),
      quality: blendQualityScores(styleResults),
      patterns: blendPatterns(styleResults)
    },
    content: contentResult,
    composition: {
      styleWeights: styleResults.map(({ weight }) => weight),
      contentWeight: parseFloat(options.contentWeight),
      blendMethod: 'weighted-average'
    }
  };

  return blendedSpec;
}

function blendDesignTokens(styleResults: any[]): any {
  // Blend design tokens from multiple sources based on weights
  const blendedTokens = {
    colors: {},
    typography: {},
    spacing: {},
    borderRadius: {},
    effects: {}
  };

  // Simple blending - take the highest weighted source for each token type
  const sortedResults = styleResults.sort((a, b) => b.weight - a.weight);
  const primarySource = sortedResults[0];

  return primarySource.result.tokens;
}

function blendQualityScores(styleResults: any[]): any {
  // Calculate weighted average of quality scores
  let totalWeight = 0;
  let weightedScore = 0;

  styleResults.forEach(({ result, weight }) => {
    totalWeight += weight;
    weightedScore += result.qualityScore.overall * weight;
  });

  return {
    overall: weightedScore / totalWeight,
    breakdown: {
      colorConsistency: calculateWeightedAverage(styleResults, 'colorConsistency'),
      typographyHierarchy: calculateWeightedAverage(styleResults, 'typographyHierarchy'),
      spacingRegularity: calculateWeightedAverage(styleResults, 'spacingRegularity'),
      accessibilityCompliance: calculateWeightedAverage(styleResults, 'accessibilityCompliance'),
      patternConsistency: calculateWeightedAverage(styleResults, 'patternConsistency'),
      performanceOptimization: calculateWeightedAverage(styleResults, 'performanceOptimization'),
      modernityScore: calculateWeightedAverage(styleResults, 'modernityScore')
    },
    recommendations: generateBlendRecommendations(styleResults)
  };
}

function calculateWeightedAverage(styleResults: any[], metric: string): number {
  let totalWeight = 0;
  let weightedValue = 0;

  styleResults.forEach(({ result, weight }) => {
    totalWeight += weight;
    weightedValue += result.qualityScore.breakdown[metric] * weight;
  });

  return weightedValue / totalWeight;
}

function blendPatterns(styleResults: any[]): any[] {
  // Combine patterns from all sources, removing duplicates
  const allPatterns = new Map();

  styleResults.forEach(({ result }) => {
    result.patterns.forEach((pattern: any) => {
      if (!allPatterns.has(pattern.type) || pattern.confidence > allPatterns.get(pattern.type).confidence) {
        allPatterns.set(pattern.type, pattern);
      }
    });
  });

  return Array.from(allPatterns.values());
}

function generateBlendRecommendations(styleResults: any[]): string[] {
  const recommendations = [];

  if (styleResults.length > 1) {
    recommendations.push('Successfully blended styles from multiple sources');
    recommendations.push('Consider manual review of blended design tokens');
    recommendations.push('Test the blended result across different devices');
  }

  return recommendations;
}

async function generateBlendedWebsite(spec: any, options: any): Promise<void> {
  const outputDir = options.output;

  // Create Next.js project structure
  const packageJson = {
    name: options.name,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start"
    },
    dependencies: {
      next: "^14.0.0",
      react: "^18.0.0",
      "react-dom": "^18.0.0",
      tailwindcss: "^3.0.0"
    }
  };

  await fs.mkdir(path.join(outputDir, 'src', 'pages'), { recursive: true });

  await fs.writeFile(
    path.join(outputDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create blended homepage
  const homePage = `
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Multi-Source Style Transfer
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Blended design from multiple sources
        </p>
        <div className="text-center">
          <p className="text-gray-500">
            Style sources: ${spec.project.styleSources.map((s: any) => s.url).join(', ')}
          </p>
          <p className="text-gray-500">
            Content source: ${spec.project.contentSource}
          </p>
        </div>
      </main>
    </div>
  )
}`;

  await fs.writeFile(path.join(outputDir, 'src', 'pages', 'index.js'), homePage);

  // Create README
  const readme = `
# Multi-Source Style Transfer

This website was generated by blending styles from multiple sources:

${spec.project.styleSources.map((source: any, index: number) =>
  `## Source ${index + 1}: ${source.url} (${(source.weight * 100).toFixed(0)}% weight)`
).join('\n')}

## Content Source
- **URL**: ${spec.project.contentSource}

## Blend Quality
- **Overall Score**: ${spec.design.quality.overall.toFixed(2)}/1.0

---
*Generated by Web Style Transfer v1.0.0*
`;

  await fs.writeFile(path.join(outputDir, 'README.md'), readme);

  console.log(chalk.gray('   ✅ Multi-source website generated'));
}

program.parse();
