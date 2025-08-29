# Web Style Transfer - AI Assistant Instructions

## System Overview

This is a S-Tier website extraction and regeneration system that analyzes existing websites, extracts their design systems, and regenerates them with improved accessibility, performance, and modern best practices.

## Required File Inputs

### Configuration Files

**MANDATORY** - System will fail without these files:

- **`package.json`** - Node.js dependencies and scripts
- **`tsconfig.json`** - TypeScript compiler configuration
- **`playwright.config.ts`** - Browser automation configuration
- **`/config/build.config.ts`** - Build system configuration
- **`/config/extraction.config.ts`** - Style extraction settings
- **`/config/composition.config.ts`** - Design composition rules

### Design System Files

**REQUIRED** for style extraction and regeneration:

- **`/specs/tokens/design-tokens.json`** - Design token definitions
- **`/specs/tokens/dark-mode-tokens.json`** - Dark mode token overrides
- **`/specs/patterns/ui-patterns.yaml`** - UI component pattern definitions
- **`/specs/patterns/interaction-patterns.yaml`** - Interaction behavior patterns
- **`/validation/design-lint-rules.json`** - Design quality validation rules
- **`/validation/wcag-rules.json`** - Accessibility compliance rules
- **`/validation/performance-budget.json`** - Performance constraints

### Template Files

**REQUIRED** for component generation:

- **`/src/templates/components/*.template.tsx`** - React component templates (all files in this directory)
- **`/src/lib/utils.ts`** - Utility functions for components

### Schema Files

**REQUIRED** for data validation:

- **`/extractors/schemas/brand.schema.ts`** - Brand extraction schema
- **`/extractors/schemas/style.schema.ts`** - Style extraction schema
- **`/extractors/schemas/spec.schema.ts`** - Specification schema
- **`/extractors/schemas/s-tier-principles.ts`** - Quality standards schema

### Documentation Files

**RECOMMENDED** for system understanding:

- **`/docs/design.md`** - Design system principles
- **`/docs/patterns.md`** - UI pattern documentation
- **`/instructions/build.md`** - Build process instructions

### Environment Setup

**MANDATORY** runtime requirements:

- **Node.js** (version 18+)
- **npm** or **yarn** package manager
- **Playwright browsers** (installed via `npx playwright install`)
- **TypeScript compiler** (included in dependencies)

### Input Validation

The system will validate all required files at startup and fail with specific error messages if any are missing or malformed. Use `npm run validate-schemas` to check file integrity before running extraction workflows.

## Core Workflows

### 1. Style Extraction Pipeline

```bash
# Extract visual styles from target website
/extract-style <url>

# Extract brand identity and assets
/extract-brand <url>

# Compose design specification
/compose-spec

# Build regenerated site
/build-site
```

### 2. Validation Pipeline

```bash
# Validate design quality
/validate-design

# Check accessibility compliance
/validate-accessibility

# Performance audit
/validate-performance
```

### 3. Style Transfer Operations

```bash
# Single source transfer
/transfer <source-url> <target-url>

# Multi-source style transfer
/transfer-multi <source1> <source2> <target>
```

## Step-by-Step Tasks

### Prerequisites Checklist

**COMPLETE ALL BEFORE STARTING:**

1. **Environment Setup**
   - [ ] Node.js 18+ installed
   - [ ] npm/yarn package manager available
   - [ ] Playwright browsers installed (`npx playwright install`)
   - [ ] All required files present (see Required File Inputs section)

2. **System Validation**
   - [ ] Run `npm install` to install dependencies
   - [ ] Run `npm run validate-schemas` to check file integrity
   - [ ] Run `npm run type-check` to verify TypeScript compilation
   - [ ] Run `npm test` to ensure test suite passes

3. **Input Preparation**
   - [ ] Valid target website URL(s) identified
   - [ ] Design requirements documented
   - [ ] Accessibility requirements specified
   - [ ] Performance targets defined

### Task 1: Style Extraction Pipeline

**OBJECTIVE**: Extract and analyze design system from target website

**Step 1.1**: Validate Target Website

- Confirm website is accessible and responsive
- Check for anti-bot measures that might block extraction
- Verify website loads within performance budget
- Document any known accessibility issues

**Step 1.2**: Execute Style Extraction

```bash
npm run extract-style <target-url>
```

- Extracts colors, typography, spacing, and layout patterns
- Generates design tokens automatically
- Captures responsive breakpoints
- Documents component usage patterns

**Step 1.3**: Execute Brand Extraction

```bash
npm run extract-brand <target-url>
```

- Extracts logo, brand colors, and visual identity
- Analyzes brand consistency across pages
- Identifies brand-specific design patterns
- Generates brand guidelines

**Step 1.4**: Validate Extraction Quality

- Review extraction quality score (must be ≥0.7)
- Verify all design tokens captured
- Check for missing or incomplete data
- Document any extraction failures

### Task 2: Design Composition

**OBJECTIVE**: Compose design specification from extracted data

**Step 2.1**: Prerequisites

- [ ] Task 1 completed successfully
- [ ] Extraction quality score ≥0.7
- [ ] All required design tokens present

**Step 2.2**: Execute Design Composition

```bash
npm run compose-spec
```

- Combines extracted styles into cohesive design system
- Applies S-tier quality standards
- Generates component specifications
- Creates responsive design rules

**Step 2.3**: Review Composed Specification

- Validate against design principles
- Check accessibility compliance
- Verify performance optimization
- Confirm brand consistency

### Task 3: Component Generation

**OBJECTIVE**: Generate React components from design specification

**Step 3.1**: Prerequisites

- [ ] Task 2 completed successfully
- [ ] Design specification validated
- [ ] Template files confirmed present

**Step 3.2**: Generate Components

```bash
npm run build-components
```

- Creates TypeScript React components
- Applies accessibility features
- Implements responsive design
- Generates component documentation

**Step 3.3**: Generate Storybook Stories

```bash
npm run storybook:generate
```

- Creates interactive component documentation
- Documents all variants and states
- Includes usage examples
- Prepares for visual testing

### Task 4: Quality Validation Pipeline

**OBJECTIVE**: Validate all outputs meet quality standards

**Step 4.1**: Prerequisites

- [ ] Task 3 completed successfully
- [ ] All components generated
- [ ] Storybook stories created

**Step 4.2**: Execute Design Validation

```bash
npm run validate-design
```

- Checks design system consistency
- Validates color contrast ratios
- Verifies typography hierarchy
- Confirms spacing regularity

**Step 4.3**: Execute Accessibility Validation

```bash
npm run validate-accessibility
```

- Runs axe-core accessibility tests
- Checks WCAG 2.1 AA compliance
- Validates keyboard navigation
- Tests screen reader compatibility

**Step 4.4**: Execute Performance Validation

```bash
npm run validate-performance
```

- Measures Core Web Vitals
- Validates bundle size limits
- Tests loading performance
- Checks runtime performance

### Task 5: Build and Deployment

**OBJECTIVE**: Create production-ready website

**Step 5.1**: Prerequisites

- [ ] Task 4 completed successfully
- [ ] All validations passed
- [ ] Quality gates approved

**Step 5.2**: Execute Website Build

```bash
npm run build-site
```

- Generates production website
- Optimizes assets and bundles
- Creates deployment artifacts
- Generates build reports

**Step 5.3**: Final Validation

```bash
npm run validate-output
```

- Confirms all outputs generated
- Validates build integrity
- Checks deployment readiness
- Generates final quality report

### Task 6: Documentation and Testing

**OBJECTIVE**: Complete documentation and test coverage

**Step 6.1**: Prerequisites

- [ ] Task 5 completed successfully
- [ ] Build artifacts generated

**Step 6.2**: Generate Documentation

```bash
npm run docs:generate
```

- Creates API documentation
- Updates component usage guides
- Generates deployment instructions
- Creates maintenance documentation

**Step 6.3**: Execute Test Suite

```bash
npm run test:all
```

- Runs unit tests (minimum 80% coverage)
- Executes integration tests
- Performs end-to-end testing
- Generates coverage reports

**Step 6.4**: Create Release Package

```bash
npm run package
```

- Creates deployment package
- Includes all artifacts and documentation
- Generates release notes
- Prepares for deployment

### Error Handling and Recovery

**IF ANY STEP FAILS:**

1. **Stop immediately** - Do not proceed to next step
2. **Document failure** - Record error messages and context
3. **Check prerequisites** - Ensure all dependencies met
4. **Validate inputs** - Confirm input files are correct
5. **Seek assistance** - Escalate to technical lead if needed
6. **Revert if necessary** - Return to last known good state

### Success Criteria

**ALL TASKS COMPLETE WHEN:**

- [ ] All validation checks pass
- [ ] Quality score ≥0.9 overall
- [ ] Test coverage ≥80%
- [ ] Accessibility compliance 100%
- [ ] Performance budget met
- [ ] All outputs generated successfully
- [ ] Documentation complete and accurate
- [ ] Ready for production deployment

## Expected Outputs

### Storybook Generation

**MANDATORY** - Interactive component documentation:

- **`/storybook/main.ts`** - Storybook configuration file
- **`/storybook/preview.ts`** - Storybook preview configuration
- **`/src/**/\*.stories.tsx`\*\* - Individual component stories (one per component)
- **`/storybook-static/`** - Built Storybook static files
- **Component stories must include:**
  - All component variants (primary, secondary, etc.)
  - Interaction states (hover, focus, disabled)
  - Responsive breakpoints
  - Accessibility examples
  - Usage documentation

### Test Generation

**MANDATORY** - Comprehensive test coverage:

- **`/src/**/\*.test.tsx`\*\* - Unit tests for components
- **`/src/**/\*.spec.ts`\*\* - Integration tests
- **`/tests/e2e/**/\*.spec.ts`\*\* - End-to-end tests with Playwright
- **`/tests/visual/`** - Visual regression test baselines
- **Test requirements:**
  - 80%+ code coverage minimum
  - Accessibility tests using axe-core
  - Visual regression tests
  - Performance tests for Core Web Vitals

### Component Library

**MANDATORY** - Generated React components:

- **`/src/components/`** - Generated component files
- **`/src/types/`** - TypeScript type definitions
- **`/src/hooks/`** - Custom React hooks
- **`/src/utils/`** - Utility functions
- **Component requirements:**
  - TypeScript with strict typing
  - Accessibility compliance (WCAG 2.1 AA)
  - Responsive design support
  - Error boundaries and loading states

### Built Website

**MANDATORY** - Complete website generation:

- **`/dist/`** - Production build output
- **`/public/`** - Static assets
- **`/index.html`** - Main HTML file
- **`/_next/static/`** - Next.js static files (if applicable)
- **Build requirements:**
  - Optimized bundle size (<500KB gzipped)
  - Core Web Vitals compliance
  - SEO optimization
  - Progressive Web App features

### Documentation Outputs

**REQUIRED** - Generated documentation:

- **`/reports/`** - Analysis and validation reports
- **`/docs/api/`** - API documentation
- **`README.md`** - Updated with component usage
- **Documentation requirements:**
  - Component prop documentation
  - Usage examples
  - Migration guides
  - Performance benchmarks

### Quality Validation Reports

**REQUIRED** - Automated quality checks:

- **`/reports/quality-score.json`** - Overall quality metrics
- **`/reports/accessibility-report.json`** - WCAG compliance results
- **`/reports/performance-report.json`** - Core Web Vitals metrics
- **`/reports/coverage-report.json`** - Test coverage data
- **Report requirements:**
  - Automated generation on build
  - Threshold validation (must pass minimum scores)
  - Historical trend tracking
  - Exportable formats (JSON, HTML, PDF)

### Output Validation

All outputs must pass validation before deployment:

- `npm run validate-output` - Validates generated files
- `npm run validate-accessibility` - WCAG compliance check
- `npm run validate-performance` - Performance budget check
- `npm run test` - Test suite execution

## Quality Standards

### Extraction Quality

- **Minimum Score**: 0.7 (70% quality threshold)
- **Extraction Time**: <60 seconds per page
- **Screenshot Quality**: 80% JPEG compression
- **Animation Support**: Full CSS animation detection

### Design Principles

- **Grid System**: 8px base grid (8, 16, 24, 32, 40, 48, 56, 64px)
- **Color Contrast**: 4.5:1 minimum (WCAG AA), 7:1 preferred (WCAG AAA)
- **Typography Scale**: 1.2 ratio (16px → 19.2px → 23px → 27.6px → 33.1px)
- **Animation Duration**: 150ms (micro-interactions), 300ms (page transitions)

### Performance Budget

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Total Bundle Size**: <500KB (gzipped)

## Code Quality Standards

### TypeScript Requirements

```typescript
// ✅ Good: Explicit typing with descriptive names
interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'typography' | 'spacing';
}

// ❌ Bad: Any types or unclear naming
interface Token {
  n: string;
  v: any;
  c: string;
}
```

### File Organization

```
src/
├── components/     # Reusable UI components
├── lib/           # Utility functions
├── types/         # TypeScript definitions
└── styles/        # Global styles and tokens
```

## Error Handling Patterns

### Graceful Degradation

```typescript
// ✅ Good: Handle errors gracefully
try {
  const result = await extractStyles(url);
  return processResult(result);
} catch (error) {
  logger.warn(`Extraction failed for ${url}:`, error);
  return fallbackResult;
}

// ❌ Bad: Let errors crash the system
const result = await extractStyles(url);
return processResult(result);
```

### Validation First

```typescript
// ✅ Good: Validate inputs before processing
function extractStyles(url: string) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided');
  }
  // ... rest of implementation
}
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance

- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: 2px solid outline, 2:1 contrast ratio
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

### Semantic HTML Structure

```html
<!-- ✅ Good: Semantic structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- ❌ Bad: Generic div structure -->
<div class="nav">
  <div class="nav-item">
    <span onclick="navigate('/')">Home</span>
  </div>
</div>
```

## Performance Optimization

### Bundle Analysis

- Use `npm run analyze` to identify large dependencies
- Implement code splitting for routes
- Lazy load non-critical components

### Image Optimization

```typescript
// ✅ Good: Responsive images with fallbacks
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

## Testing Strategy

### Unit Tests

- Test utility functions and business logic
- Mock external dependencies
- Use descriptive test names

### Integration Tests

- Test complete workflows end-to-end
- Use Playwright for browser automation
- Test accessibility with axe-core

### Performance Tests

- Monitor Core Web Vitals
- Test with various network conditions
- Validate bundle size limits

## Documentation Standards

### Code Comments

```typescript
/**
 * Extracts design tokens from a webpage using Playwright
 * @param url - The webpage URL to extract from
 * @param options - Extraction configuration options
 * @returns Promise resolving to extracted design tokens
 * @throws {ExtractionError} When extraction fails or times out
 */
async function extractDesignTokens(
  url: string,
  options: ExtractionOptions
): Promise<DesignToken[]> {
  // Implementation with inline comments for complex logic
}
```

### README Files

- Include setup instructions
- Document available scripts
- Provide usage examples
- Link to detailed documentation

## Development Workflow

### Before Committing

1. Run type checking: `npm run type-check`
2. Run linting: `npm run lint`
3. Run tests: `npm test`
4. Validate build: `npm run build`

### Code Review Checklist

- [ ] TypeScript types are correct and specific
- [ ] Functions have proper error handling
- [ ] Code follows established patterns
- [ ] Tests are included for new functionality
- [ ] Documentation is updated
- [ ] Performance impact is considered

'Do Not' Rules

### Critical System Violations 🚫

**VIOLATION CONSEQUENCES**: System failure, build rejection, rollback required

**DO NOT:**

- **Skip file validation** - Never bypass `npm run validate-schemas` or `npm run validate-output`
- **Modify core configuration files** without approval - `package.json`, `tsconfig.json`, `playwright.config.ts`
- **Disable TypeScript strict mode** - All code must compile with `--strict` flag
- **Remove accessibility features** - WCAG compliance is non-negotiable
- **Bypass performance budgets** - Core Web Vitals must be met or exceeded
- **Skip Storybook generation** - Interactive documentation is mandatory
- **Omit test coverage** - 80% minimum coverage required for all new code

### Quality Compromises 🚫

**VIOLATION CONSEQUENCES**: Quality gate failure, deployment blocked, rework required

**DO NOT:**

- **Accept contrast ratios below 4.5:1** - WCAG AA standard minimum
- **Use magic numbers** - All values must be named constants
- **Create components without TypeScript** - Strict typing required
- **Skip error handling** - All functions must have try/catch or graceful degradation
- **Ignore loading states** - Users must see feedback for all async operations
- **Remove focus indicators** - Keyboard accessibility is mandatory
- **Use generic divs for interactive elements** - Semantic HTML required
- **Skip responsive design** - Mobile-first approach mandatory

### Workflow Violations 🚫

**VIOLATION CONSEQUENCES**: Process failure, manual intervention required, timeline delays

**DO NOT:**

- **Run extraction without validated inputs** - Check all required files first
- **Skip validation pipeline** - All workflows must pass validation steps
- **Commit without tests** - New features require test coverage
- **Deploy without accessibility audit** - axe-core checks mandatory
- **Merge without code review** - All changes require peer review
- **Skip documentation updates** - README and docs must reflect changes
- **Run builds on unvalidated schemas** - Schema validation is prerequisite

### Output Requirements Violations 🚫

**VIOLATION CONSEQUENCES**: Incomplete deliverables, client rejection, scope creep

**DO NOT:**

- **Generate components without Storybook stories** - Each component needs `.stories.tsx`
- **Skip unit tests** - Every component requires `.test.tsx`
- **Omit integration tests** - End-to-end workflows need `.spec.ts`
- **Skip visual regression tests** - UI changes require baseline updates
- **Skip performance tests** - Core Web Vitals must be measured
- **Omit accessibility tests** - axe-core integration required
- **Skip documentation generation** - API docs and usage guides mandatory

### Code Pattern Violations 🚫

**VIOLATION CONSEQUENCES**: Code review rejection, refactoring required, technical debt accumulation

**DO NOT use:**

#### Magic Numbers

```typescript
// ❌ VIOLATION: Magic numbers
if (score > 0.7) { ... }

// ✅ REQUIRED: Named constants
const MIN_QUALITY_SCORE = 0.7;
if (score > MIN_QUALITY_SCORE) { ... }
```

#### Deep Nesting

```typescript
// ❌ VIOLATION: Deep nesting
function processData(data) {
  if (data) {
    if (data.items) {
      data.items.forEach(item => {
        if (item.valid) {
          // ... deep logic
        }
      });
    }
  }
}

// ✅ REQUIRED: Early returns
function processData(data) {
  if (!data?.items) return;

  data.items.forEach(item => {
    if (!item.valid) return;
    // ... logic
  });
}
```

#### Large Functions

```typescript
// ❌ VIOLATION: Monolithic function
function extractAndProcess(url) {
  // 100+ lines of mixed concerns
}

// ✅ REQUIRED: Single responsibility functions
async function extractStyles(url: string): Promise<Styles> {
  // Only extraction logic
}

function processStyles(styles: Styles): ProcessedStyles {
  // Only processing logic
}
```

#### Any Types

```typescript
// ❌ VIOLATION: Any types
function processData(data: any) { ... }

// ✅ REQUIRED: Strict typing
interface DataStructure {
  id: string;
  items: Item[];
  metadata: Metadata;
}
function processData(data: DataStructure) { ... }
```

### Violation Enforcement

**IMMEDIATE ACTION REQUIRED** for violations:

1. **Critical violations** - Stop work, revert changes, seek approval
2. **Quality violations** - Fix immediately, add tests, update documentation
3. **Workflow violations** - Revert to last good state, follow proper process
4. **Output violations** - Complete missing deliverables before proceeding
5. **Pattern violations** - Refactor code, add code review, prevent future occurrences

**RECURRING VIOLATIONS** will result in:

- Escalation to technical lead
- Mandatory training sessions
- Performance review impact
- Potential project reassignment

## Tool Usage Guidelines

### When to Use Each Tool

**codebase_search**: Understanding existing code structure and finding implementation patterns
**run_terminal_cmd**: Executing build scripts, running tests, or system operations
**grep**: Finding specific code patterns or text matches
**search_replace**: Making targeted code changes with proper context
**read_file**: Understanding file contents and structure
**list_dir**: Exploring project organization

### Command Execution Best Practices

- Always check if you're in the right directory
- Use non-interactive flags for automated scripts
- Handle potential command failures gracefully
- Provide clear explanations for complex commands

Remember: This system is designed for professional web development with enterprise-level quality standards. Every decision should prioritize accessibility, performance, and maintainability.
