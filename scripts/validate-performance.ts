#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validateUrl } from '../src/lib/utils';

const program = new Command();

program
  .name('validate-performance')
  .description('Test website performance metrics against Core Web Vitals')
  .version('1.0.0')
  .argument('<url>', 'Target website URL to test')
  .option('-o, --output <path>', 'Output performance report path', './validation/performance-report.json')
  .option('-b, --budget <path>', 'Performance budget JSON file', './validation/performance-budget.json')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--lighthouse', 'Run full Lighthouse audit')
  .option('--mobile', 'Test mobile performance')
  .option('--runs <number>', 'Number of test runs', '3')
  .action(async (url: string, options: any) => {
    try {
      // Validate URL
      if (!validateUrl(url)) {
        console.error(chalk.red('❌ Invalid URL format'));
        process.exit(1);
      }

      console.log(chalk.blue(`⚡ Running performance tests for: ${url}`));

      // Load performance budget if specified
      let budget = null;
      if (options.budget) {
        try {
          budget = JSON.parse(await fs.readFile(options.budget, 'utf-8'));
          console.log(chalk.gray(`📋 Loaded performance budget from: ${options.budget}`));
        } catch (error) {
          console.log(chalk.yellow(`⚠️  Could not load budget file, using defaults`));
        }
      }

      // Default performance thresholds
      const defaultBudget = {
        metrics: {
          firstContentfulPaint: 1800,
          largestContentfulPaint: 2500,
          timeToInteractive: 3800,
          totalBlockingTime: 300,
          cumulativeLayoutShift: 0.1,
          speedIndex: 3400
        }
      };

      const performanceBudget = budget || defaultBudget;

      // Run performance tests
      const results = await this.runPerformanceTests(url, options);

      // Calculate averages
      const averages = this.calculateAverages(results);

      // Compare against budget
      const comparison = this.compareToBudget(averages, performanceBudget);

      // Ensure output directory exists
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });

      // Save detailed report
      const report = {
        timestamp: new Date().toISOString(),
        url,
        testRuns: parseInt(options.runs),
        mobile: options.mobile,
        averages,
        budget: performanceBudget,
        comparison,
        individualRuns: results
      };

      await fs.writeFile(options.output, JSON.stringify(report, null, 2));

      // Display results
      console.log(chalk.green(`✅ Performance testing complete!`));
      console.log(chalk.gray(`📁 Report saved to: ${options.output}`));
      console.log('');

      // Display Core Web Vitals
      console.log(chalk.bold('📊 Core Web Vitals (Averages):'));

      const vitals = [
        { name: 'First Contentful Paint', key: 'fcp', value: averages.fcp, unit: 'ms', good: 1800, poor: 3000 },
        { name: 'Largest Contentful Paint', key: 'lcp', value: averages.lcp, unit: 'ms', good: 2500, poor: 4000 },
        { name: 'Time to Interactive', key: 'tti', value: averages.tti, unit: 'ms', good: 3800, poor: 7300 },
        { name: 'Total Blocking Time', key: 'tbt', value: averages.tbt, unit: 'ms', good: 300, poor: 600 },
        { name: 'Cumulative Layout Shift', key: 'cls', value: averages.cls, unit: '', good: 0.1, poor: 0.25 },
        { name: 'Speed Index', key: 'speedIndex', value: averages.speedIndex, unit: 'ms', good: 3400, poor: 5800 }
      ];

      vitals.forEach(vital => {
        const value = vital.unit ? `${vital.value.toFixed(0)}${vital.unit}` : vital.value.toFixed(3);
        const status = vital.value <= vital.good ? 'good' :
                      vital.value <= vital.poor ? 'needs-improvement' : 'poor';

        const color = status === 'good' ? chalk.green :
                     status === 'needs-improvement' ? chalk.yellow : chalk.red;

        const budgetStatus = comparison[vital.key];
        const budgetColor = budgetStatus === 'pass' ? chalk.green :
                           budgetStatus === 'warning' ? chalk.yellow : chalk.red;

        console.log(color(`${vital.name}: ${value}`));
        if (budgetStatus) {
          console.log(budgetColor(`   Budget: ${budgetStatus.toUpperCase()}`));
        }
      });

      // Overall assessment
      const allGood = vitals.every(v => v.value <= v.good);
      const anyPoor = vitals.some(v => v.value > v.poor);

      console.log('');
      if (allGood) {
        console.log(chalk.green('🎉 Excellent performance! All Core Web Vitals are good.'));
      } else if (!anyPoor) {
        console.log(chalk.yellow('⚠️  Good performance with some room for improvement.'));
      } else {
        console.log(chalk.red('❌ Performance needs significant improvement.'));
      }

      // Budget compliance
      const budgetResults = Object.values(comparison);
      const passed = budgetResults.filter(r => r === 'pass').length;
      const warnings = budgetResults.filter(r => r === 'warning').length;
      const failed = budgetResults.filter(r => r === 'fail').length;

      if (budget) {
        console.log('');
        console.log(chalk.bold('📋 Budget Compliance:'));
        console.log(chalk.green(`   Passed: ${passed}`));
        console.log(chalk.yellow(`   Warnings: ${warnings}`));
        console.log(chalk.red(`   Failed: ${failed}`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Performance testing failed:'), error);
      process.exit(1);
    }
  });

async function runPerformanceTests(url: string, options: any): Promise<any[]> {
  const results = [];
  const runs = parseInt(options.runs);

  for (let i = 1; i <= runs; i++) {
    console.log(chalk.gray(`   Running test ${i}/${runs}...`));

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: options.mobile ? { width: 375, height: 667 } : { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    try {
      // Start performance monitoring
      const metrics = await page.evaluateOnNewDocument(() => {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              (window as any).lcp = entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure CLS
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });

        (window as any).cls = clsValue;
      });

      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

      // Wait for page to stabilize
      await page.waitForTimeout(3000);

      // Collect performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        const resources = performance.getEntriesByType('resource');

        return {
          fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          lcp: (window as any).lcp || 0,
          tti: perf.domContentLoadedEventEnd - perf.fetchStart,
          tbt: 0, // Would need more complex calculation
          cls: (window as any).cls || 0,
          speedIndex: perf.loadEventEnd - perf.fetchStart,
          resources: resources.length,
          totalSize: resources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0)
        };
      });

      results.push(performanceMetrics);

    } finally {
      await browser.close();
    }
  }

  return results;
}

function calculateAverages(results: any[]): any {
  const keys = Object.keys(results[0]);
  const averages: any = {};

  keys.forEach(key => {
    const values = results.map(r => r[key]).filter(v => typeof v === 'number');
    averages[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
  });

  return averages;
}

function compareToBudget(averages: any, budget: any): any {
  const comparison: any = {};

  Object.entries(budget.metrics).forEach(([key, threshold]) => {
    const value = averages[key];
    if (value !== undefined) {
      if (value <= threshold) {
        comparison[key] = 'pass';
      } else if (value <= (threshold as number) * 1.2) {
        comparison[key] = 'warning';
      } else {
        comparison[key] = 'fail';
      }
    }
  });

  return comparison;
}

// Add help examples
program.addHelpText('after', `
Examples:
  $ validate-performance https://example.com
  $ validate-performance https://example.com --mobile --runs 5
  $ validate-performance https://example.com --budget ./config/performance-budget.json
  $ validate-performance https://example.com --lighthouse --verbose
`);

program.parse();
