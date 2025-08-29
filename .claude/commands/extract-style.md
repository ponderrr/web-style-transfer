---
command: extract-style
description: Extract design tokens and patterns from a website
parameters:
  - url: Target website URL to extract style from
  - output: Output file path (optional, defaults to specs/tokens/design-tokens.json)
  - screenshots: Capture screenshots during extraction (optional, default: false)
  - viewport: Viewport size for extraction (optional, default: 1440x900)
  - quality: Extraction quality preset (optional, fast|comprehensive|detailed)
---

Extracts comprehensive design system from the target website including colors, typography, spacing, and UI patterns using advanced Playwright automation and AI-powered analysis.

## Usage Examples

```
/extract-style https://stripe.com
/extract-style https://vercel.com --output ./custom-design.json --screenshots
/extract-style https://linear.app --viewport 1920x1080 --quality comprehensive
/extract-style https://example.com --output ./tokens.json
```

## What Gets Extracted

### 🎨 Color System
- **Semantic Colors**: Primary, secondary, success, warning, error colors
- **Neutral Scale**: Complete grayscale system (50-950)
- **Brand Colors**: Company-specific color palette
- **Interactive States**: Hover, focus, active, disabled states
- **Background Colors**: Surface and elevation colors
- **Text Colors**: Readable text color combinations

### 📝 Typography
- **Font Families**: Complete font stack analysis
- **Type Scale**: Modular scale with proper ratios
- **Font Weights**: Available weight variations
- **Line Heights**: Optimal readability settings
- **Letter Spacing**: Precise spacing adjustments

### 📏 Spacing & Layout
- **Spacing Scale**: Consistent spacing system (8px base)
- **Grid System**: Container widths and gutter spacing
- **Breakpoints**: Responsive design breakpoints
- **Border Radius**: Consistent corner rounding system

### 🎯 UI Patterns
- **Navigation**: Header, sidebar, mobile menu patterns
- **Hero Sections**: Landing page layout patterns
- **Cards**: Content container patterns
- **Forms**: Input and interaction patterns
- **Buttons**: Call-to-action and interactive elements

### ♿ Accessibility
- **Color Contrast**: WCAG AA compliance validation
- **Focus Indicators**: Keyboard navigation support
- **Touch Targets**: Mobile-friendly sizing
- **Semantic HTML**: Proper document structure

## Extraction Process

### Phase 1: Site Analysis
1. **Initial Load**: Navigate to target URL with network idle waiting
2. **Viewport Testing**: Test across desktop, tablet, and mobile viewports
3. **Resource Discovery**: Identify CSS, fonts, and design assets
4. **DOM Analysis**: Map page structure and component hierarchy

### Phase 2: Design Token Extraction
1. **Color Analysis**: Extract and normalize color palette
2. **Typography Parsing**: Analyze font usage and hierarchy
3. **Spacing Detection**: Identify spacing patterns and grids
4. **Effect Extraction**: Capture shadows, borders, animations

### Phase 3: Pattern Recognition
1. **Component Detection**: Identify reusable UI components
2. **Layout Analysis**: Map page layouts and structures
3. **Interaction Mapping**: Document user interaction patterns
4. **Responsive Behavior**: Analyze mobile and tablet adaptations

### Phase 4: Quality Assessment
1. **Consistency Scoring**: Rate design system consistency
2. **Accessibility Audit**: WCAG compliance evaluation
3. **Performance Analysis**: Loading and rendering efficiency
4. **Modernity Score**: Current design trends alignment

## Output Format

### Design Tokens JSON
```json
{
  "version": "1.0",
  "source": {
    "url": "https://example.com",
    "extractedAt": "2024-01-01T00:00:00Z",
    "viewport": "1440x900"
  },
  "tokens": {
    "colors": {
      "primary": { "$value": "#3B82F6", "$type": "color" },
      "secondary": { "$value": "#6B7280", "$type": "color" },
      "neutral": {
        "50": { "$value": "#F9FAFB", "$type": "color" },
        "100": { "$value": "#F3F4F6", "$type": "color" },
        // ... complete neutral scale
      }
    },
    "typography": {
      "fontFamily": {
        "$value": "Inter, system-ui, sans-serif",
        "$type": "fontFamily"
      },
      "scale": {
        "h1": {
          "size": "2.25rem",
          "lineHeight": "2.5rem",
          "fontWeight": "700",
          "$type": "typography"
        }
        // ... complete type scale
      }
    },
    "spacing": {
      "1": { "$value": "0.25rem", "$type": "spacing" },
      "2": { "$value": "0.5rem", "$type": "spacing" },
      // ... complete spacing scale
    }
  },
  "patterns": [
    {
      "type": "navigation",
      "variant": "topbar",
      "confidence": 0.92,
      "properties": {
        "layout": "fixed",
        "mobileMenu": true
      }
    }
  ],
  "quality": {
    "overall": 0.89,
    "breakdown": {
      "colorConsistency": 0.95,
      "typographyHierarchy": 0.87,
      "spacingRegularity": 0.91,
      "accessibilityCompliance": 0.82,
      "patternConsistency": 0.88,
      "performanceOptimization": 0.92,
      "modernityScore": 0.91
    },
    "recommendations": [
      "Improve color contrast for secondary text",
      "Standardize spacing around interactive elements"
    ]
  }
}
```

## Quality Presets

### Fast (Default)
- Basic color and typography extraction
- Essential pattern detection
- Quick accessibility check
- Suitable for initial analysis

### Comprehensive
- Deep color system analysis
- Complete typography scale extraction
- Advanced pattern recognition
- Full accessibility audit
- Performance analysis included

### Detailed
- Pixel-perfect extraction
- Animation and micro-interaction capture
- Cross-browser compatibility testing
- Comprehensive performance profiling
- Visual regression baseline creation

## Integration Options

### Design Tools
- **Figma**: Import tokens as design system
- **Sketch**: Create library from extracted patterns
- **Adobe XD**: Generate component library
- **Storybook**: Build interactive component documentation

### Development Frameworks
- **Tailwind CSS**: Generate custom configuration
- **Styled Components**: Create theme system
- **CSS-in-JS**: Build design system foundations
- **Sass/SCSS**: Generate variable system

### Quality Assurance
- **Visual Regression**: Baseline for future comparisons
- **Accessibility Testing**: Automated WCAG compliance
- **Performance Monitoring**: Core Web Vitals tracking
- **Cross-browser Testing**: Compatibility validation

## Error Handling

### Network Issues
- Automatic retry with exponential backoff
- Timeout handling with graceful degradation
- Fallback to cached or partial extraction

### Parsing Errors
- Robust CSS parsing with error recovery
- Fallback values for malformed properties
- Logging of extraction issues for debugging

### Content Blocking
- Detection of anti-bot measures
- Respect for robots.txt directives
- Ethical extraction practices

## Performance Considerations

### Extraction Speed
- Parallel processing of multiple viewports
- Optimized DOM queries and analysis
- Smart caching of repeated assets
- Configurable timeouts and limits

### Resource Usage
- Memory-efficient processing
- Cleanup of browser instances
- Bandwidth-aware asset downloading
- Configurable extraction depth

## Security & Ethics

### Data Protection
- No extraction of personal information
- Respect for privacy policies
- Secure handling of extracted data
- No persistent storage of sensitive content

### Website Impact
- Minimal server load with rate limiting
- Polite crawling with delays
- Resource-conscious extraction
- Compliance with website terms

## Troubleshooting

### Common Issues
- **Dynamic Content**: Use wait conditions for SPAs
- **Anti-bot Measures**: May require manual intervention
- **Large Sites**: Use depth limits for focused extraction
- **Custom Fonts**: May require additional font loading time

### Optimization Tips
- Use specific selectors for targeted extraction
- Configure appropriate timeouts for slow sites
- Enable screenshots only when needed
- Use comprehensive preset for thorough analysis

## Next Steps

After extraction, you can:
1. **Review Quality**: Check the quality score and recommendations
2. **Refine Tokens**: Adjust extracted values for your needs
3. **Generate Components**: Use patterns to build component library
4. **Create Documentation**: Build style guide from extracted system
5. **Integrate Framework**: Apply tokens to your preferred framework

## Support

For issues or questions:
- Check extraction logs for detailed error information
- Verify target website is accessible and stable
- Ensure sufficient system resources for extraction
- Review browser compatibility requirements
