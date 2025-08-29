#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';
import { QualityScorer } from '../extractors/playwright/quality-scorer';

const program = new Command();

program
  .name('validate-design')
  .description('Validate design consistency and quality against S-tier standards')
  .version('1.0.0')
  .argument('<spec-path>', 'Path to design tokens JSON file')
  .option('-o, --output <path>', 'Output validation report path', './validation/design-report.json')
  .option('-t, --threshold <score>', 'Minimum acceptable score (0-1)', '0.7')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--strict', 'Fail on any issue below excellent score (0.9)')
  .action(async (specPath: string, options: any) => {
    try {
      console.log(chalk.blue(`🎨 Validating design quality for: ${specPath}`));

      // Check if spec file exists
      try {
        await fs.access(specPath);
      } catch {
        console.error(chalk.red(`❌ Spec file not found: ${specPath}`));
        process.exit(1);
      }

      // Load design tokens
      const specData = JSON.parse(await fs.readFile(specPath, 'utf-8'));

      // Validate required structure
      if (!specData.tokens || !specData.patterns) {
        console.error(chalk.red('❌ Invalid spec format: missing tokens or patterns'));
        process.exit(1);
      }

      // Initialize quality scorer
      const qualityScorer = new QualityScorer();

      // Calculate quality score
      const qualityScore = qualityScorer.calculateScore(specData.tokens, specData.patterns || []);

      // Ensure output directory exists
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });

      // Save detailed report
      const report = {
        timestamp: new Date().toISOString(),
        specPath,
        qualityScore,
        passed: qualityScore.overall >= parseFloat(options.threshold),
        recommendations: qualityScore.recommendations,
      };

      await fs.writeFile(options.output, JSON.stringify(report, null, 2));

      // Display results
      console.log(chalk.green(`✅ Design validation complete!`));
      console.log(chalk.gray(`📁 Report saved to: ${options.output}`));
      console.log('');

      // Display score breakdown
      console.log(chalk.bold('📊 Quality Score Breakdown:'));
      console.log(chalk.gray(`Overall Score: ${qualityScore.overall.toFixed(2)}/1.0`));

      if (options.verbose) {
        Object.entries(qualityScore.breakdown).forEach(([key, score]) => {
          const color = score >= 0.8 ? chalk.green : score >= 0.6 ? chalk.yellow : chalk.red;
          console.log(color(`${key}: ${score.toFixed(2)}`));
        });
      }

      console.log('');

      // Display recommendations
      if (qualityScore.recommendations.length > 0) {
        console.log(chalk.bold('💡 Recommendations:'));
        qualityScore.recommendations.forEach(rec => {
          console.log(chalk.yellow(`   • ${rec}`));
        });
      }

      // Check threshold
      const threshold = parseFloat(options.threshold);
      if (qualityScore.overall < threshold) {
        console.log('');
        console.log(chalk.red(`❌ Quality score below threshold (${threshold})`));

        if (options.strict) {
          process.exit(1);
        }
      } else {
        console.log('');
        console.log(chalk.green(`✅ Design meets quality standards!`));
      }
    } catch (error) {
      console.error(chalk.red('❌ Design validation failed:'), error);
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText(
  'after',
  `
Examples:
  $ validate-design specs/tokens/design-tokens.json
  $ validate-design specs/tokens/design-tokens.json --threshold 0.8 --verbose
  $ validate-design specs/tokens/design-tokens.json --strict --output ./reports/design-audit.json
`
);

program.parse();
