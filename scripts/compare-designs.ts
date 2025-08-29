#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

program
  .name('compare-designs')
  .description('Compare multiple design extraction results')
  .version('1.0.0')
  .argument('<extraction-paths...>', 'Paths to extraction results JSON files (minimum 2)')
  .option('-o, --output <path>', 'Output comparison report path', './comparison/design-comparison.json')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (extractionPaths: string[], options: any) => {
    try {
      if (extractionPaths.length < 2) {
        console.error(chalk.red('❌ At least 2 extraction files are required for comparison'));
        process.exit(1);
      }

      console.log(chalk.blue(`🔍 Comparing ${extractionPaths.length} design extractions`));

      // Load all extraction results
      const extractions = [];
      for (const path of extractionPaths) {
        try {
          await fs.access(path);
          const data = JSON.parse(await fs.readFile(path, 'utf-8'));
          extractions.push({ path, data });
        } catch (error) {
          console.error(chalk.red(`❌ Failed to load ${path}:`), error);
          process.exit(1);
        }
      }

      // Perform comparison
      const comparison = await compareDesigns(extractions);

      // Ensure output directory exists
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });

      // Save comparison report
      await fs.writeFile(options.output, JSON.stringify(comparison, null, 2));

      // Display results
      console.log(chalk.green(`✅ Comparison complete!`));
      console.log(chalk.gray(`📁 Report saved to: ${options.output}`));
      console.log('');

      // Display summary
      console.log(chalk.bold('📊 Design Comparison Summary:'));
      comparison.designs.forEach((design, index) => {
        const score = design.qualityScore?.overall || 0;
        const color = score >= 0.8 ? chalk.green : score >= 0.6 ? chalk.yellow : chalk.red;
        console.log(color(`   Design ${index + 1}: ${score.toFixed(2)} - ${design.url || design.path}`));
      });

      if (comparison.recommendations.length > 0) {
        console.log('');
        console.log(chalk.bold('💡 Recommendations:'));
        comparison.recommendations.slice(0, 5).forEach(rec => {
          console.log(chalk.yellow(`   • ${rec}`));
        });
      }

    } catch (error) {
      console.error(chalk.red('❌ Comparison failed:'), error);
      process.exit(1);
    }
  });

async function compareDesigns(extractions: any[]): Promise<any> {
  const comparison = {
    timestamp: new Date().toISOString(),
    designs: extractions.map(({ path, data }) => ({
      path,
      url: data.url,
      qualityScore: data.qualityScore,
      patternCount: data.patterns?.length || 0,
      tokenCount: countTokens(data.tokens)
    })),
    comparison: {
      qualityComparison: compareQualityScores(extractions),
      patternComparison: comparePatterns(extractions),
      tokenComparison: compareTokens(extractions)
    },
    recommendations: generateComparisonRecommendations(extractions)
  };

  return comparison;
}

function countTokens(tokens: any): number {
  let count = 0;
  if (tokens?.colors) count += Object.keys(tokens.colors).length;
  if (tokens?.typography) count += Object.keys(tokens.typography).length;
  if (tokens?.spacing) count += Object.keys(tokens.spacing).length;
  return count;
}

function compareQualityScores(extractions: any[]): any {
  const scores = extractions.map(({ data }) => data.qualityScore?.overall || 0);
  const best = Math.max(...scores);
  const worst = Math.min(...scores);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  return {
    scores,
    best,
    worst,
    average,
    range: best - worst
  };
}

function comparePatterns(extractions: any[]): any {
  const patternStats = extractions.map(({ data }) => ({
    count: data.patterns?.length || 0,
    types: data.patterns?.reduce((acc: any, pattern: any) => {
      acc[pattern.type] = (acc[pattern.type] || 0) + 1;
      return acc;
    }, {}) || {}
  }));

  const uniqueTypes = new Set();
  patternStats.forEach(stat => {
    Object.keys(stat.types).forEach(type => uniqueTypes.add(type));
  });

  return {
    stats: patternStats,
    uniquePatternTypes: Array.from(uniqueTypes),
    mostCommonPatterns: findMostCommonPatterns(patternStats)
  };
}

function compareTokens(extractions: any[]): any {
  const tokenStats = extractions.map(({ data }) => ({
    total: countTokens(data.tokens),
    colors: Object.keys(data.tokens?.colors || {}).length,
    typography: Object.keys(data.tokens?.typography || {}).length,
    spacing: Object.keys(data.tokens?.spacing || {}).length
  }));

  return {
    stats: tokenStats,
    averages: {
      total: tokenStats.reduce((sum, stat) => sum + stat.total, 0) / tokenStats.length,
      colors: tokenStats.reduce((sum, stat) => sum + stat.colors, 0) / tokenStats.length,
      typography: tokenStats.reduce((sum, stat) => sum + stat.typography, 0) / tokenStats.length,
      spacing: tokenStats.reduce((sum, stat) => sum + stat.spacing, 0) / tokenStats.length
    }
  };
}

function findMostCommonPatterns(patternStats: any[]): any {
  const patternCounts: any = {};

  patternStats.forEach(stat => {
    Object.entries(stat.types).forEach(([type, count]: [string, any]) => {
      patternCounts[type] = (patternCounts[type] || 0) + count;
    });
  });

  return Object.entries(patternCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);
}

function generateComparisonRecommendations(extractions: any[]): string[] {
  const recommendations = [];

  const qualityScores = extractions.map(({ data }) => data.qualityScore?.overall || 0);
  const bestScore = Math.max(...qualityScores);
  const worstScore = Math.min(...qualityScores);

  if (bestScore - worstScore > 0.3) {
    recommendations.push('Significant quality difference detected - consider using the highest quality design as primary reference');
  }

  const avgPatterns = extractions.reduce((sum, { data }) => sum + (data.patterns?.length || 0), 0) / extractions.length;
  if (avgPatterns < 5) {
    recommendations.push('Low pattern detection across designs - consider manual component identification');
  }

  const patternTypes = new Set();
  extractions.forEach(({ data }) => {
    data.patterns?.forEach((pattern: any) => patternTypes.add(pattern.type));
  });

  if (patternTypes.size > 10) {
    recommendations.push('High pattern diversity - consider consolidating similar patterns');
  }

  return recommendations;
}

program.parse();
