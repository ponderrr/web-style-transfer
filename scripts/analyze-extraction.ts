#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

program
  .name('analyze-extraction')
  .description('Analyze extraction results and generate insights')
  .version('1.0.0')
  .argument('<extraction-path>', 'Path to extraction results JSON file')
  .option('-o, --output <path>', 'Output analysis report path', './analysis/extraction-report.json')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (extractionPath: string, options: any) => {
    try {
      console.log(chalk.blue(`📊 Analyzing extraction results: ${extractionPath}`));

      // Validate extraction file exists
      try {
        await fs.access(extractionPath);
      } catch {
        console.error(chalk.red(`❌ Extraction file not found: ${extractionPath}`));
        process.exit(1);
      }

      // Load extraction results
      const extraction = JSON.parse(await fs.readFile(extractionPath, 'utf-8'));

      // Perform analysis
      const analysis = await analyzeExtraction(extraction);

      // Ensure output directory exists
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });

      // Save analysis report
      await fs.writeFile(options.output, JSON.stringify(analysis, null, 2));

      // Display results
      console.log(chalk.green(`✅ Analysis complete!`));
      console.log(chalk.gray(`📁 Report saved to: ${options.output}`));
      console.log('');

      // Display key insights
      console.log(chalk.bold('📊 Extraction Analysis Summary:'));
      console.log(chalk.gray(`   Patterns Detected: ${analysis.patterns.count}`));
      console.log(chalk.gray(`   Quality Score: ${analysis.quality.overall.toFixed(2)}/1.0`));
      console.log(chalk.gray(`   Extraction Duration: ${analysis.performance.duration}ms`));

      if (analysis.recommendations.length > 0) {
        console.log('');
        console.log(chalk.bold('💡 Recommendations:'));
        analysis.recommendations.slice(0, 5).forEach((rec: string) => {
          console.log(chalk.yellow(`   • ${rec}`));
        });
      }
    } catch (error) {
      console.error(chalk.red('❌ Analysis failed:'), error);
      process.exit(1);
    }
  });

async function analyzeExtraction(extraction: any): Promise<any> {
  const analysis = {
    timestamp: new Date().toISOString(),
    patterns: analyzePatterns(extraction.patterns || []),
    quality: extraction.qualityScore || {},
    performance: analyzePerformance(extraction.metadata || {}),
    recommendations: generateAnalysisRecommendations(extraction),
    insights: generateInsights(extraction),
  };

  return analysis;
}

function analyzePatterns(patterns: any[]): any {
  const patternTypes = patterns.reduce((acc, pattern) => {
    acc[pattern.type] = (acc[pattern.type] || 0) + 1;
    return acc;
  }, {});

  const avgConfidence =
    patterns.length > 0 ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length : 0;

  return {
    count: patterns.length,
    types: patternTypes,
    averageConfidence: avgConfidence,
    highConfidencePatterns: patterns.filter(p => p.confidence > 0.8).length,
  };
}

function analyzePerformance(metadata: any): any {
  return {
    duration: metadata.extractionDuration || 0,
    viewportsTested: metadata.viewportsTested || [],
    success: metadata.extractionDuration < 30000, // Under 30 seconds
  };
}

function generateAnalysisRecommendations(extraction: any): string[] {
  const recommendations = [];

  if (extraction.qualityScore?.overall < 0.7) {
    recommendations.push('Consider re-extracting with different viewport settings');
  }

  if (extraction.patterns?.length < 3) {
    recommendations.push(
      'Limited pattern detection - site may benefit from manual component identification'
    );
  }

  const highConfidencePatterns = extraction.patterns?.filter((p: any) => p.confidence > 0.8) || [];
  if (highConfidencePatterns.length === 0) {
    recommendations.push('No high-confidence patterns detected - verify extraction settings');
  }

  return recommendations;
}

function generateInsights(extraction: any): any {
  const insights = {
    patternDiversity: calculatePatternDiversity(extraction.patterns || []),
    designComplexity: calculateDesignComplexity(extraction.tokens || {}),
    accessibilityReadiness: assessAccessibilityReadiness(extraction),
  };

  return insights;
}

function calculatePatternDiversity(patterns: any[]): number {
  const uniqueTypes = new Set(patterns.map(p => p.type));
  return uniqueTypes.size / Math.max(patterns.length, 1);
}

function calculateDesignComplexity(tokens: any): number {
  let complexity = 0;

  if (tokens.colors) complexity += Object.keys(tokens.colors).length * 0.1;
  if (tokens.typography) complexity += Object.keys(tokens.typography).length * 0.2;
  if (tokens.spacing) complexity += Object.keys(tokens.spacing).length * 0.1;

  return Math.min(complexity, 1);
}

function assessAccessibilityReadiness(extraction: any): string {
  if (extraction.qualityScore?.breakdown?.accessibilityCompliance > 0.8) {
    return 'excellent';
  } else if (extraction.qualityScore?.breakdown?.accessibilityCompliance > 0.6) {
    return 'good';
  } else {
    return 'needs-improvement';
  }
}

program.parse();
