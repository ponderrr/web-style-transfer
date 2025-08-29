# Web Style Transfer System - Complete Build Instructions

## Project Overview

Build a production-grade system that extracts design systems from websites and regenerates them as modern, accessible applications. The system uses Playwright for extraction, TypeScript for type safety, and generates Next.js/Tailwind sites following Stripe/Linear-level quality standards.

## Core Architecture

- **Extraction Layer**: Playwright scripts that analyze DOM and computed styles
- **Processing Layer**: TypeScript modules that normalize and enhance extracted data
- **Generation Layer**: Template-based site builder that creates Next.js projects
- **Validation Layer**: Automated testing for accessibility, performance, and quality

## Directory Structure to Create

```
web-style-transfer/
├── .claude/
├── extractors/
├── scripts/
├── validation/
├── config/
├── src/
├── tests/
└── docs/
```

---

# FILE-BY-FILE BUILD INSTRUCTIONS

## 1. `/extractors/playwright/pattern-detector.ts`

**Purpose**: Detect and classify UI patterns from DOM structure
**Requirements**:

- Detect navigation (sidebar, topbar, hamburger, breadcrumb)
- Identify hero sections (centered, split, background-image, video)
- Find card patterns (grid, masonry, carousel, list)
- Detect forms (contact, login, signup, multi-step, search)
- Identify tables (data-grid, comparison, pricing)

**Implementation Details**:

```typescript
export class PatternDetector {
  // Each pattern needs:
  // - Confidence score (0-1)
  // - Variant detection
  // - Property extraction
  // - Accessibility features

  async detectPatterns(page: Page): Promise<UIPattern[]>;
  private async detectNavigationPattern(page: Page): Promise<UIPattern>;
  private async detectHeroPattern(page: Page): Promise<UIPattern>;
  private async detectCardPattern(page: Page): Promise<UIPattern>;
  private async detectFormPattern(page: Page): Promise<UIPattern>;
  private async detectTablePattern(page: Page): Promise<UIPattern>;
  private calculateConfidence(element: Element): number;
}
```

**Rules**:

- Confidence > 0.7 to include pattern
- Check multiple selectors per pattern type
- Extract semantic HTML indicators
- Record accessibility features (ARIA, roles)
- Detect responsive behavior

---

## 2. `/extractors/playwright/accessibility-checker.ts`

**Purpose**: Validate WCAG 2.1 AA compliance
**Requirements**:

- Color contrast validation (4.5:1 normal, 3:1 large text)
- Keyboard navigation testing
- ARIA attribute validation
- Focus management checks
- Screen reader compatibility

**Implementation Details**:

```typescript
export class AccessibilityChecker {
  async checkWCAG(page: Page): Promise<WCAGReport>;
  async checkColorContrast(page: Page): Promise<ContrastReport>;
  async testKeyboardNavigation(page: Page): Promise<KeyboardReport>;
  async validateARIA(page: Page): Promise<ARIAReport>;
  async checkFocusManagement(page: Page): Promise<FocusReport>;
  private calculateContrastRatio(color1: string, color2: string): number;
}
```

**Rules**:

- Use axe-core for automated testing
- Test all interactive elements for keyboard access
- Verify focus indicators are visible
- Check alt text on images
- Validate form labels

---

## 3. `/extractors/playwright/quality-scorer.ts`

**Purpose**: Score design quality against S-tier standards
**Requirements**:

- Score color consistency (semantic usage, limited palette)
- Rate typography hierarchy (clear scale, readable sizes)
- Evaluate spacing regularity (grid adherence)
- Check pattern consistency
- Assess modern practices

**Implementation Details**:

```typescript
export class QualityScorer {
  private readonly WEIGHTS = {
    colorConsistency: 0.15,
    typographyHierarchy: 0.15,
    spacingRegularity: 0.15,
    accessibilityCompliance: 0.25,
    patternConsistency: 0.1,
    performanceOptimization: 0.1,
    modernityScore: 0.1,
  };

  calculateScore(tokens: DesignTokens, patterns: UIPattern[]): QualityScore;
  private scoreColorConsistency(colors: ColorSystem): number;
  private scoreTypographyHierarchy(typography: Typography): number;
  private scoreSpacingRegularity(spacing: SpacingScale): number;
}
```

**Rules**:

- Return score 0-1 for each category
- Weight scores for overall rating
- Provide specific recommendations for scores < 0.8
- Consider number of unique values (fewer is better)

---

## 4. `/extractors/playwright/utils/color-normalizer.ts`

**Purpose**: Normalize and categorize colors
**Requirements**:

- Convert all colors to HSL
- Group similar colors (±5% difference)
- Identify semantic roles
- Generate accessible variations
- Create dark mode palette

**Implementation Details**:

```typescript
export class ColorNormalizer {
  normalizeColors(colors: string[]): NormalizedColorSystem;
  private rgbToHsl(r: number, g: number, b: number): HSL;
  private groupSimilarColors(colors: HSL[]): ColorGroup[];
  private identifySemanticRole(color: HSL): SemanticRole;
  private ensureAccessibleContrast(fg: string, bg: string): string;
  private generateDarkModePalette(lightColors: ColorSystem): ColorSystem;
}
```

**Rules**:

- Maximum 12 unique colors after grouping
- Always include semantic colors (success, warning, error, info)
- Ensure AA contrast (4.5:1) for all text colors
- Generate 11-step neutral scale (50-950)

---

## 5. `/extractors/playwright/utils/typography-analyzer.ts`

**Purpose**: Analyze and normalize typography
**Requirements**:

- Detect modular scale
- Identify font families
- Calculate optimal line heights
- Detect font loading
- Map hierarchy

**Implementation Details**:

```typescript
export class TypographyAnalyzer {
  analyzeTypography(elements: Element[]): TypographySystem;
  private detectModularScale(sizes: number[]): number;
  private extractFontStacks(elements: Element[]): FontFamily[];
  private calculateOptimalLineHeight(fontSize: number): number;
  private detectFontLoadingStrategy(page: Page): FontLoadingStrategy;
}
```

**Rules**:

- Prefer modular scales: 1.125, 1.2, 1.25, 1.333, 1.414
- Minimum body text: 14px
- Line height: 1.4-1.6 for body, 1.2-1.4 for headings
- Maximum 3 font families

---

## 6. `/extractors/playwright/utils/spacing-detector.ts`

**Purpose**: Detect spacing system
**Requirements**:

- Find base unit (4px or 8px)
- Create consistent scale
- Detect grid usage
- Identify container widths
- Map responsive gutters

**Implementation Details**:

```typescript
export class SpacingDetector {
  detectSpacingSystem(elements: Element[]): SpacingSystem;
  private findBaseUnit(values: number[]): number;
  private createSpacingScale(baseUnit: number): number[];
  private detectGridSystem(page: Page): GridSystem;
  private findContainerWidths(page: Page): ContainerWidths;
}
```

**Rules**:

- Prefer 8px base unit
- Maximum 16 spacing values
- Round to nearest base unit
- Detect CSS Grid and Flexbox usage

---

## 7. `/scripts/extract-brand.ts`

**Purpose**: CLI script for brand extraction
**Requirements**:

- Similar structure to extract-style.ts
- Handle crawling parameters
- Display extraction progress
- Save results to JSON

**Implementation Details**:

```typescript
// Use commander for CLI
// Import BrandExtractor class
// Add options for:
// - max pages to crawl
// - rate limiting
// - output path
// Display:
// - Pages analyzed
// - Content types found
// - Voice/tone detected
// - Word count
```

---

## 8. `/scripts/validate-design.ts`

**Purpose**: Validate design consistency
**Requirements**:

- Check token usage in components
- Verify spacing grid adherence
- Validate color relationships
- Check typography hierarchy
- Score overall consistency

**Implementation Details**:

```typescript
async function validateDesign(specPath: string): Promise<ValidationReport> {
  // Load spec
  // Check each validation rule
  // Generate report with:
  // - Pass/fail per category
  // - Specific issues found
  // - Recommendations
  // - Overall score
}
```

---

## 9. `/scripts/validate-accessibility.ts`

**Purpose**: Run accessibility tests
**Requirements**:

- Use axe-playwright
- Test keyboard navigation
- Check color contrast
- Validate ARIA usage
- Test with screen reader

**Implementation Details**:

```typescript
async function validateAccessibility(url: string): Promise<A11yReport> {
  // Launch Playwright
  // Load page
  // Run axe-core
  // Test keyboard nav
  // Check focus management
  // Generate detailed report
}
```

---

## 10. `/scripts/validate-performance.ts`

**Purpose**: Test performance metrics
**Requirements**:

- Run Lighthouse programmatically
- Check bundle sizes
- Measure Core Web Vitals
- Test loading speed
- Validate image optimization

**Implementation Details**:

```typescript
async function validatePerformance(url: string): Promise<PerformanceReport> {
  // Run Lighthouse CI
  // Extract metrics:
  // - FCP < 1.8s
  // - LCP < 2.5s
  // - CLS < 0.1
  // - TTI < 3.8s
  // Check bundle sizes
}
```

---

## 11. `/scripts/style-transfer.ts`

**Purpose**: Mix style from one site with content from another
**Requirements**:

- Accept two URLs (style source, content source)
- Run both extractors
- Merge intelligently
- Generate new site

**Implementation Details**:

```typescript
async function styleTransfer(styleUrl: string, contentUrl: string) {
  // Extract style from styleUrl
  // Extract brand/content from contentUrl
  // Compose with style priority
  // Generate site
}
```

---

## 12. `/config/extraction.config.ts`

**Purpose**: Configuration for extraction process
**Implementation**:

```typescript
export default {
  viewports: {
    mobile: 375,
    tablet: 768,
    desktop: 1440,
    wide: 1920,
  },
  quality: {
    minScore: 0.7,
    requireAccessibility: true,
    maxExtractionTime: 60000,
    screenshotQuality: 80,
  },
  crawling: {
    maxPages: 50,
    maxDepth: 3,
    rateLimit: 500,
    timeout: 30000,
    respectRobotsTxt: true,
    userAgent: 'WebStyleTransfer/1.0',
  },
  patterns: {
    minConfidence: 0.7,
    detectVariants: true,
    maxPatternsPerType: 10,
  },
};
```

---

## 13. `/validation/wcag-rules.json`

**Purpose**: WCAG 2.1 AA compliance rules
**Implementation**:

```json
{
  "colorContrast": {
    "normalText": 4.5,
    "largeText": 3.0,
    "uiComponents": 3.0,
    "logotypes": 0
  },
  "focusIndicator": {
    "minWidth": 2,
    "contrastRatio": 3,
    "style": "solid or dotted"
  },
  "touchTargets": {
    "minSize": 44,
    "spacing": 8,
    "exceptions": ["inline links"]
  },
  "images": {
    "requireAltText": true,
    "decorativeAltEmpty": true
  },
  "forms": {
    "requireLabels": true,
    "errorIdentification": true,
    "errorSuggestions": true
  },
  "keyboard": {
    "allInteractive": true,
    "noKeyboardTrap": true,
    "skipLinks": true
  }
}
```

---

## 14. `/validation/performance-budget.json`

**Purpose**: Performance thresholds
**Implementation**:

```json
{
  "metrics": {
    "firstContentfulPaint": 1800,
    "largestContentfulPaint": 2500,
    "timeToInteractive": 3800,
    "totalBlockingTime": 300,
    "cumulativeLayoutShift": 0.1,
    "speedIndex": 3400
  },
  "bundles": {
    "javascript": {
      "initial": 100000,
      "lazy": 200000
    },
    "css": {
      "initial": 20000,
      "lazy": 50000
    },
    "fonts": {
      "total": 100000
    },
    "images": {
      "lazy": true,
      "formats": ["webp", "avif"]
    }
  },
  "lighthouse": {
    "performance": 90,
    "accessibility": 95,
    "bestPractices": 90,
    "seo": 90
  }
}
```

---

## 15. `/src/lib/utils.ts`

**Purpose**: Utility functions for generated sites
**Implementation**:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US').format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
```

---

## 16. `/src/templates/components/Navigation.template.tsx`

**Purpose**: Template for navigation component generation
**Requirements**:

- Support multiple variants (sidebar, topbar, mobile)
- Fully accessible (keyboard nav, ARIA)
- Responsive behavior
- Active state indicators

**Implementation**:

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  items: NavItem[];
  variant: 'sidebar' | 'topbar' | 'mobile';
  logo?: LogoProps;
  className?: string;
}

// Template must include:
// - Semantic nav element
// - Skip link for accessibility
// - Mobile menu with proper ARIA
// - Keyboard navigation (arrow keys)
// - Focus trap when mobile menu open
// - Active page indication
```

---

## 17. `/src/templates/components/Hero.template.tsx`

**Purpose**: Template for hero sections
**Requirements**:

- Multiple layouts (centered, split, background)
- Responsive text scaling
- CTA buttons with proper hierarchy
- Optional media (image, video)

**Implementation**:

```typescript
// Must support:
// - Heading (H1) with proper size
// - Subheading with contrast
// - Primary and secondary CTAs
// - Background patterns/gradients
// - Responsive padding
// - Animation on scroll (optional)
```

---

## 18. `/.claude/agents/brand-extractor.md`

**Content**:

```markdown
# Brand Extractor Agent

You are specialized in analyzing brand identity, content structure, and voice from websites.

## Tools

- Read, Write, Bash, BrowserControl

## Primary Functions

1. Extract brand identity (name, tagline, logo)
2. Analyze content and voice
3. Map information architecture
4. Identify conversion patterns
5. Extract SEO metadata

## Process

1. Crawl site systematically
2. Extract semantic content
3. Analyze language for voice/tone
4. Build content inventory
5. Map site structure

## Quality Standards

- Never invent content
- Preserve exact brand voice
- Respect rate limits
- Handle errors gracefully
```

---

## 19. `/.claude/agents/design-reviewer.md`

**Use the design-review agent content provided in the original context**

---

## 20. `/.claude/commands/extract-style.md`

**Content**:

```markdown
---
command: extract-style
description: Extract design tokens and patterns from a website
parameters:
  - url: Target website URL
  - output: Output file path (optional)
  - screenshots: Capture screenshots (optional)
---

Extracts comprehensive design system from the target website including colors, typography, spacing, and UI patterns.

Usage:
/extract-style https://example.com

The extraction process:

1. Loads website in Playwright
2. Analyzes at multiple viewports
3. Extracts computed styles
4. Detects UI patterns
5. Scores quality
6. Saves to JSON
```

---

## Testing Requirements

Each module needs tests:

- Unit tests for pure functions
- Integration tests for extractors
- E2E tests for full pipeline
- Visual regression tests for components
- Accessibility tests with axe-core

---

## Package Dependencies

Install all required packages:

```bash
npm install playwright commander chalk next react react-dom tailwindcss @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install -D typescript @types/node @types/react ts-node axe-playwright lighthouse prettier eslint
```

---

## Execution Order

1. Create directory structure
2. Install dependencies
3. Build extraction layer (extractors/)
4. Build processing layer (scripts/)
5. Build validation layer (validation/)
6. Build templates (src/templates/)
7. Create configs
8. Add Claude agents
9. Write tests
10. Create documentation

## Success Criteria

- Extraction works on any website
- Quality scores are accurate
- Generated sites pass all validations
- Accessibility score > 95
- Performance score > 90
- Code is fully typed with TypeScript
- All commands work via CLI
- Comprehensive error handling
