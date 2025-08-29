# Style Extraction Workflow

## Overview
The style extraction workflow analyzes existing websites and extracts their visual design systems, including colors, typography, spacing, and component patterns. This process transforms unstructured web content into structured design tokens and patterns.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **Playwright**: Latest version with browser support
- **Network Access**: Ability to access target websites
- **Storage**: Minimum 500MB free space for extracted assets

### Input Validation
```typescript
interface ExtractionInput {
  url: string;
  validateUrl: (url: string) => boolean;
  checkAccessibility: boolean;
  respectRobotsTxt: boolean;
  userAgent: string;
}

// URL validation rules
function validateExtractionUrl(url: string): boolean {
  const urlPattern = /^https?:\/\/.+/i;
  const isValidFormat = urlPattern.test(url);

  const isReachable = await checkUrlReachability(url);
  const respectsRobots = await checkRobotsTxt(url);

  return isValidFormat && isReachable && respectsRobots;
}
```

## Step-by-Step Process

### Step 1: Target Analysis
**Duration**: 30-60 seconds
**Purpose**: Initial assessment of the target website

1. **URL Validation**
   ```bash
   # Validate target URL format and accessibility
   curl -I --max-time 10 https://example.com
   ```

2. **Robots.txt Compliance**
   ```typescript
   // Check robots.txt before extraction
   const robotsTxt = await fetchRobotsTxt(url);
   const isAllowed = robotsTxt.isPathAllowed('/');

   if (!isAllowed) {
     throw new Error('Crawling not permitted by robots.txt');
   }
   ```

3. **Site Structure Analysis**
   - Identify main navigation
   - Detect content types (articles, products, etc.)
   - Map URL patterns and hierarchies
   - Estimate page count and complexity

### Step 2: Page Loading & Rendering
**Duration**: 10-30 seconds per page
**Purpose**: Load pages with full CSS and JavaScript execution

1. **Browser Launch**
   ```typescript
   const browser = await chromium.launch({
     headless: true,
     args: [
       '--no-sandbox',
       '--disable-setuid-sandbox',
       '--disable-dev-shm-usage'
     ]
   });
   ```

2. **Page Navigation**
   ```typescript
   const page = await browser.newPage();
   await page.setViewportSize({ width: 1440, height: 900 });

   // Set user agent to avoid bot detection
   await page.setExtraHTTPHeaders({
     'User-Agent': 'WebStyleTransfer/1.0'
   });

   await page.goto(url, {
     waitUntil: 'networkidle',
     timeout: 30000
   });
   ```

3. **Content Stabilization**
   ```typescript
   // Wait for dynamic content to load
   await page.waitForLoadState('domcontentloaded');
   await page.waitForLoadState('networkidle');

   // Wait for animations to complete
   await page.waitForTimeout(1000);
   ```

### Step 3: Visual Analysis
**Duration**: 20-45 seconds per page
**Purpose**: Extract visual design elements and patterns

1. **Color Extraction**
   ```typescript
   // Extract color palette from CSS and inline styles
   const colors = await page.$$eval('[style], style, link[rel="stylesheet"]',
     extractColorTokens
   );

   // Analyze color usage frequency
   const colorUsage = analyzeColorFrequency(colors);
   const primaryColors = selectPrimaryPalette(colorUsage);
   ```

2. **Typography Analysis**
   ```typescript
   // Extract font families and sizes
   const typography = await page.$$eval('*',
     extractTypographyTokens
   );

   // Build font scale hierarchy
   const fontScale = buildTypographyScale(typography);
   const fontFamilies = identifyFontFamilies(typography);
   ```

3. **Spacing Detection**
   ```typescript
   // Measure spacing patterns
   const spacing = await page.$$eval('*',
     extractSpacingPatterns
   );

   // Normalize to 8px grid system
   const normalizedSpacing = normalizeToGrid(spacing, 8);
   ```

4. **Component Pattern Recognition**
   ```typescript
   // Identify common UI patterns
   const patterns = await detectUIPatterns(page);

   // Classify components by type
   const components = classifyComponents(patterns);
   ```

### Step 4: Quality Assessment
**Duration**: 15-30 seconds per page
**Purpose**: Evaluate extraction quality and completeness

1. **Design Quality Scoring**
   ```typescript
   interface QualityMetrics {
     colorConsistency: number;    // 0-1 scale
     typographyHierarchy: number; // 0-1 scale
     spacingRegularity: number;   // 0-1 scale
     accessibilityCompliance: number; // 0-1 scale
     patternCompleteness: number; // 0-1 scale
   }

   const qualityScore = calculateQualityScore(extractedData);
   ```

2. **Accessibility Audit**
   ```typescript
   // Run automated accessibility checks
   const accessibilityResults = await runAxeAudit(page);

   // Calculate WCAG compliance score
   const wcagScore = calculateComplianceScore(accessibilityResults);
   ```

3. **Performance Metrics**
   ```typescript
   // Measure page performance
   const performanceMetrics = await page.evaluate(() => {
     const perf = performance.getEntriesByType('navigation')[0];
     return {
       loadTime: perf.loadEventEnd - perf.loadEventStart,
       domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
       firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
       largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime
     };
   });
   ```

### Step 5: Data Processing & Storage
**Duration**: 10-20 seconds per page
**Purpose**: Process and store extracted design data

1. **Token Normalization**
   ```typescript
   // Convert extracted data to DTCG format
   const designTokens = normalizeToDTCGFormat(extractedData);

   // Validate token structure
   const isValid = validateDesignTokens(designTokens);
   ```

2. **Asset Extraction**
   ```typescript
   // Extract and optimize images
   const images = await extractImages(page);
   const optimizedImages = await optimizeImages(images, {
     quality: 80,
     formats: ['webp', 'jpg', 'png']
   });
   ```

3. **Data Serialization**
   ```typescript
   // Save extraction results
   const extractionResult = {
     url: targetUrl,
     timestamp: new Date().toISOString(),
     tokens: designTokens,
     patterns: detectedPatterns,
     quality: qualityScore,
     accessibility: accessibilityResults,
     performance: performanceMetrics,
     metadata: {
       extractionDuration: Date.now() - startTime,
       playwrightVersion: playwright.version(),
       extractorVersion: '1.0.0'
     }
   };

   await saveExtractionResult(extractionResult);
   ```

## Output Structure

### Directory Structure
```
extraction-results/
├── [domain]_[timestamp]/
│   ├── tokens/
│   │   ├── colors.json
│   │   ├── typography.json
│   │   ├── spacing.json
│   │   └── components.json
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── patterns/
│   │   └── ui-patterns.json
│   ├── reports/
│   │   ├── quality-report.json
│   │   ├── accessibility-report.json
│   │   └── performance-report.json
│   └── metadata.json
```

### Data Format Standards

#### Design Tokens (DTCG Format)
```json
{
  "color": {
    "primary": {
      "base": {
        "$value": "#0066cc",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  },
  "typography": {
    "font": {
      "family": {
        "base": {
          "$value": "Inter, system-ui, sans-serif",
          "$type": "fontFamily"
        }
      }
    }
  }
}
```

#### Quality Report
```json
{
  "overall": 0.87,
  "breakdown": {
    "colorConsistency": 0.92,
    "typographyHierarchy": 0.85,
    "spacingRegularity": 0.88,
    "accessibilityCompliance": 0.95,
    "patternConsistency": 0.78
  },
  "recommendations": [
    "Consider consolidating similar color values",
    "Improve heading hierarchy consistency"
  ]
}
```

## Error Handling & Recovery

### Common Issues & Solutions

1. **Timeout Errors**
   ```typescript
   try {
     await page.goto(url, { timeout: 30000 });
   } catch (error) {
     if (error.name === 'TimeoutError') {
       // Retry with longer timeout
       await page.goto(url, { timeout: 60000 });
     }
   }
   ```

2. **Anti-Bot Detection**
   ```typescript
   // Use realistic user agent and behavior
   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

   // Add random delays between actions
   await page.waitForTimeout(Math.random() * 1000 + 500);
   ```

3. **Dynamic Content Loading**
   ```typescript
   // Wait for specific elements or conditions
   await page.waitForFunction(
     () => document.querySelector('.main-content') !== null
   );

   // Handle infinite scroll
   await scrollToBottom(page);
   ```

### Fallback Strategies
- Use cached results for previously extracted sites
- Implement progressive extraction (basic styles first, then advanced patterns)
- Provide manual override options for complex sites

## Performance Optimization

### Parallel Processing
```typescript
// Extract multiple pages concurrently
const extractionPromises = urls.map(url =>
  extractStyles(url, config)
);

const results = await Promise.allSettled(extractionPromises);
```

### Resource Management
- Limit concurrent browser instances
- Implement connection pooling
- Cache frequently accessed resources
- Clean up browser instances after use

### Memory Management
```typescript
// Monitor memory usage
const memoryUsage = process.memoryUsage();
if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
  // Trigger garbage collection or restart process
}
```

## Monitoring & Logging

### Progress Tracking
```typescript
interface ExtractionProgress {
  total: number;
  completed: number;
  current: string;
  estimatedTimeRemaining: number;
  errors: Error[];
}

const progress = new ProgressTracker(totalUrls);
progress.on('progress', (data) => {
  console.log(`${data.completed}/${data.total} pages extracted`);
});
```

### Error Reporting
```typescript
interface ExtractionError {
  url: string;
  timestamp: string;
  error: Error;
  context: {
    browserVersion: string;
    pageLoadTime: number;
    networkConditions: object;
  };
}

// Log errors for analysis and improvement
await logExtractionError(extractionError);
```

## Quality Assurance

### Automated Validation
- Validate extracted tokens against DTCG schema
- Check color contrast ratios automatically
- Verify responsive breakpoint coverage
- Test accessibility compliance

### Manual Review Process
1. Review extracted design tokens for accuracy
2. Validate color palette completeness
3. Check typography hierarchy consistency
4. Verify component pattern identification
5. Test responsive behavior across breakpoints

This extraction workflow ensures comprehensive, high-quality design system extraction while maintaining performance, accessibility, and data integrity standards.
