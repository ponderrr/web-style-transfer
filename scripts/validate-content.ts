#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { join } from 'path';

interface BuildSpec {
  generation: {
    pages: Array<{
      path: string;
      name: string;
      components: Array<{
        component: string;
        variant: string;
        props: Record<string, any>;
      }>;
    }>;
  };
}

interface ContentSpec {
  pages?: Record<
    string,
    {
      meta?: {
        title?: string;
        description?: string;
        og?: Record<string, string>;
      };
      components?: Record<string, Record<string, any>>;
    }
  >;
}

interface ValidationResult {
  pagesMissingContent: Array<{
    path: string;
    name: string;
    missingSections: Array<{
      component: string;
      variant: string;
      props: Record<string, any>;
      reason: string;
    }>;
  }>;
  unusedContentKeys: string[];
  missingMetaFor: Array<{
    path: string;
    name: string;
    missingMeta: string[];
  }>;
  summary: {
    totalPages: number;
    pagesWithCompleteContent: number;
    pagesMissingContent: number;
    unusedContentEntries: number;
    pagesWithCompleteMeta: number;
    pagesMissingMeta: number;
  };
}

function validateContentCoverage(): ValidationResult {
  const buildSpecPath = join(process.cwd(), 'specs', 'composed', 'build-spec.json');
  const contentSpecPath = join(process.cwd(), 'specs', 'content', 'site-content.json');

  // Read build specification
  const buildSpec: BuildSpec = JSON.parse(readFileSync(buildSpecPath, 'utf-8'));

  // Read content specification (may not exist or be empty)
  let contentSpec: ContentSpec = {};
  try {
    const contentData = readFileSync(contentSpecPath, 'utf-8');
    if (contentData.trim()) {
      contentSpec = JSON.parse(contentData);
    }
  } catch (error) {
    console.warn(
      `Warning: Could not read content spec: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  const result: ValidationResult = {
    pagesMissingContent: [],
    unusedContentKeys: [],
    missingMetaFor: [],
    summary: {
      totalPages: 0,
      pagesWithCompleteContent: 0,
      pagesMissingContent: 0,
      unusedContentEntries: 0,
      pagesWithCompleteMeta: 0,
      pagesMissingMeta: 0,
    },
  };

  result.summary.totalPages = buildSpec.generation.pages.length;

  // Check each page in build spec
  for (const page of buildSpec.generation.pages) {
    const pageContent = contentSpec.pages?.[page.path];
    let hasCompleteContent = true;
    let hasCompleteMeta = true;
    const missingSections: ValidationResult['pagesMissingContent'][0]['missingSections'] = [];
    const missingMeta: string[] = [];

    // Check components
    for (const component of page.components) {
      const componentContent = pageContent?.components?.[component.component]?.[component.variant];

      if (!componentContent) {
        hasCompleteContent = false;
        missingSections.push({
          component: component.component,
          variant: component.variant,
          props: component.props,
          reason: 'No content entry found in site-content.json',
        });
      } else {
        // Check if required props are present
        for (const [propKey] of Object.entries(component.props)) {
          if (!(propKey in componentContent)) {
            hasCompleteContent = false;
            missingSections.push({
              component: component.component,
              variant: component.variant,
              props: component.props,
              reason: `Missing required prop: ${propKey}`,
            });
          }
        }
      }
    }

    // Check meta information
    if (!pageContent?.meta) {
      hasCompleteMeta = false;
      missingMeta.push('title', 'description', 'og:title', 'og:description', 'og:image');
    } else {
      const meta = pageContent.meta;
      if (!meta['title']) missingMeta.push('title');
      if (!meta['description']) missingMeta.push('description');
      if (!meta.og?.['title']) missingMeta.push('og:title');
      if (!meta.og?.['description']) missingMeta.push('og:description');
      if (!meta.og?.['image']) missingMeta.push('og:image');

      if (missingMeta.length > 0) {
        hasCompleteMeta = false;
      }
    }

    // Record results
    if (!hasCompleteContent) {
      result.pagesMissingContent.push({
        path: page.path,
        name: page.name,
        missingSections,
      });
      result.summary.pagesMissingContent++;
    } else {
      result.summary.pagesWithCompleteContent++;
    }

    if (!hasCompleteMeta) {
      result.missingMetaFor.push({
        path: page.path,
        name: page.name,
        missingMeta,
      });
      result.summary.pagesMissingMeta++;
    } else {
      result.summary.pagesWithCompleteMeta++;
    }
  }

  // Check for unused content (simplified check)
  if (contentSpec.pages) {
    for (const [pagePath] of Object.entries(contentSpec.pages)) {
      const buildPage = buildSpec.generation.pages.find(p => p.path === pagePath);
      if (!buildPage) {
        result.unusedContentKeys.push(pagePath);
        result.summary.unusedContentEntries++;
      }
    }
  }

  return result;
}

function printValidationReport(result: ValidationResult): void {
  console.log('='.repeat(60));
  console.log('CONTENT COVERAGE VALIDATION REPORT');
  console.log('='.repeat(60));

  const isPassing =
    result.summary.pagesMissingContent === 0 &&
    result.summary.pagesMissingMeta === 0 &&
    result.summary.unusedContentEntries === 0;

  console.log(`\nOverall Status: ${isPassing ? '✅ PASS' : '❌ FAIL'}\n`);

  console.log('SUMMARY:');
  console.log(`- Total Pages: ${result.summary.totalPages}`);
  console.log(`- Pages with Complete Content: ${result.summary.pagesWithCompleteContent}`);
  console.log(`- Pages Missing Content: ${result.summary.pagesMissingContent}`);
  console.log(`- Unused Content Entries: ${result.summary.unusedContentEntries}`);
  console.log(`- Pages with Complete Meta: ${result.summary.pagesWithCompleteMeta}`);
  console.log(`- Pages Missing Meta: ${result.summary.pagesMissingMeta}`);

  if (result.pagesMissingContent.length > 0) {
    console.log('\n❌ PAGES MISSING CONTENT:');
    for (const page of result.pagesMissingContent) {
      console.log(`\nPage: ${page.path} (${page.name})`);
      for (const section of page.missingSections) {
        console.log(`  - Component: ${section.component} (${section.variant})`);
        console.log(`    Reason: ${section.reason}`);
      }
    }
  }

  if (result.missingMetaFor.length > 0) {
    console.log('\n❌ MISSING META INFORMATION:');
    for (const page of result.missingMetaFor) {
      console.log(`\nPage: ${page.path} (${page.name})`);
      console.log(`  Missing: ${page.missingMeta.join(', ')}`);
    }
  }

  if (result.unusedContentKeys.length > 0) {
    console.log('\n⚠️  UNUSED CONTENT KEYS:');
    for (const key of result.unusedContentKeys) {
      console.log(`  - ${key}`);
    }
  }

  if (!isPassing) {
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('1. Update /specs/content/site-content.json with missing content');
    console.log('2. Add meta information for all pages');
    console.log('3. Remove or repurpose unused content entries');
    console.log('4. Run this validation again to verify fixes');
  }

  console.log('\n' + '='.repeat(60));
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const result = validateContentCoverage();

    // Write JSON report
    const fs = await import('fs');
    fs.writeFileSync(
      join(process.cwd(), 'reports', 'content.json'),
      JSON.stringify(result, null, 2)
    );

    // Print human-readable report
    printValidationReport(result);

    // Exit with appropriate code
    const exitCode =
      result.summary.pagesMissingContent === 0 &&
      result.summary.pagesMissingMeta === 0 &&
      result.summary.unusedContentEntries === 0
        ? 0
        : 1;
    process.exit(exitCode);
  } catch (error: unknown) {
    console.error('Validation failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

export { validateContentCoverage, ValidationResult };
