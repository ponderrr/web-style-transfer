#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { AccessibilityChecker } from '../extractors/playwright/accessibility-checker';
import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validateUrl } from '../src/lib/utils';

const program = new Command();

program
  .name('validate-accessibility')
  .description('Run WCAG 2.1 AA accessibility tests on a website')
  .version('1.0.0')
  .argument('<url>', 'Target website URL to test')
  .option('-o, --output <path>', 'Output accessibility report path', './validation/accessibility-report.json')
  .option('-l, --level <level>', 'WCAG conformance level (A, AA, AAA)', 'AA')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--screenshot', 'Capture screenshots of violations')
  .option('--viewport <size>', 'Viewport size (widthxheight)', '1440x900')
  .action(async (url: string, options: any) => {
    try {
      // Validate URL
      if (!validateUrl(url)) {
        console.error(chalk.red('❌ Invalid URL format'));
        process.exit(1);
      }

      console.log(chalk.blue(`♿ Running accessibility tests for: ${url}`));

      // Parse viewport
      const [width, height] = options.viewport.split('x').map(Number);
      if (!width || !height) {
        console.error(chalk.red('❌ Invalid viewport format. Use WIDTHxHEIGHT'));
        process.exit(1);
      }

      // Launch browser
      console.log(chalk.gray('🚀 Launching browser...'));
      const browser = await chromium.launch();
      const context = await browser.newContext({
        viewport: { width, height }
      });
      const page = await context.newPage();

      try {
        // Navigate to page
        console.log(chalk.gray('📄 Loading page...'));
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        // Run accessibility checks
        console.log(chalk.gray('🔍 Analyzing accessibility...'));
        const checker = new AccessibilityChecker();
        const report = await checker.checkWCAG(page);

        // Ensure output directory exists
        const outputDir = path.dirname(options.output);
        await fs.mkdir(outputDir, { recursive: true });

        // Save detailed report
        const fullReport = {
          timestamp: new Date().toISOString(),
          url,
          viewport: options.viewport,
          wcagLevel: options.level,
          report
        };

        await fs.writeFile(options.output, JSON.stringify(fullReport, null, 2));

        // Display results
        console.log(chalk.green(`✅ Accessibility testing complete!`));
        console.log(chalk.gray(`📁 Report saved to: ${options.output}`));
        console.log('');

        // Display score and summary
        const scoreColor = report.score >= 95 ? chalk.green :
                          report.score >= 90 ? chalk.yellow : chalk.red;

        console.log(chalk.bold('📊 Accessibility Score:'));
        console.log(scoreColor(`${report.score}/100`));
        console.log('');

        console.log(chalk.bold('🚨 Violations Summary:'));
        console.log(chalk.red(`   Critical: ${report.summary.critical}`));
        console.log(chalk.red(`   Serious: ${report.summary.serious}`));
        console.log(chalk.yellow(`   Moderate: ${report.summary.moderate}`));
        console.log(chalk.gray(`   Minor: ${report.summary.minor}`));
        console.log('');

        // Display top recommendations
        if (report.recommendations.length > 0) {
          console.log(chalk.bold('💡 Top Recommendations:'));
          report.recommendations.slice(0, 5).forEach(rec => {
            console.log(chalk.yellow(`   • ${rec}`));
          });

          if (report.recommendations.length > 5) {
            console.log(chalk.gray(`   ... and ${report.recommendations.length - 5} more`));
          }
        }

        // Check WCAG compliance
        const isCompliant = report.score >= 95;
        console.log('');

        if (isCompliant) {
          console.log(chalk.green(`✅ Passes WCAG ${options.level} standards!`));
        } else {
          console.log(chalk.red(`❌ Does not meet WCAG ${options.level} standards`));
          console.log(chalk.gray(`   Required score: 95+, Current: ${report.score}`));
        }

        // Detailed violations if verbose
        if (options.verbose && report.violations.length > 0) {
          console.log('');
          console.log(chalk.bold('🔍 Detailed Violations:'));

          const topViolations = report.violations
            .sort((a, b) => {
              const impactOrder = { critical: 4, serious: 3, moderate: 2, minor: 1 };
              return impactOrder[b.impact] - impactOrder[a.impact];
            })
            .slice(0, 10);

          topViolations.forEach((violation, index) => {
            const impactColor = violation.impact === 'critical' ? chalk.red :
                              violation.impact === 'serious' ? chalk.red :
                              violation.impact === 'moderate' ? chalk.yellow : chalk.gray;

            console.log(impactColor(`${index + 1}. ${violation.description}`));
            console.log(chalk.gray(`   Element: ${violation.element}`));
            console.log(chalk.gray(`   Guideline: ${violation.guideline}`));
            console.log('');
          });
        }

      } finally {
        await browser.close();
      }

    } catch (error) {
      console.error(chalk.red('❌ Accessibility testing failed:'), error);
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText('after', `
Examples:
  $ validate-accessibility https://example.com
  $ validate-accessibility https://example.com --level AAA --verbose
  $ validate-accessibility https://example.com --viewport 375x667 --screenshot
  $ validate-accessibility https://example.com --output ./reports/a11y-audit.json
`);

program.parse();
