---
command: style-transfer
description: Transfer style from one website to content from another - create a modern version
parameters:
  - style-url: Source website URL for style extraction
  - content-url: Source website URL for content extraction
  - output: Output directory for generated site (optional, defaults to ./output/style-transfer-site)
  - name: Project name (optional, defaults to style-transfer-site)
  - style-weight: Style influence weight 0-1 (optional, defaults to 0.7)
  - content-weight: Content influence weight 0-1 (optional, defaults to 1.0)
  - skip-validation: Skip design validation after generation (optional, default: false)
---

Transfers design system and style patterns from one website to content from another, generating a modern, accessible website that combines the best of both sources.

## Usage Examples

```
/style-transfer https://stripe.com https://mycompany.com
/style-transfer https://vercel.com https://mycompany.com --output ./sites/vercel-style --name vercel-inspired
/style-transfer https://linear.app https://mycompany.com --style-weight 0.8 --content-weight 0.9
/style-transfer https://airbnb.com https://mycompany.com --output ./airbnb-style --skip-validation
```

## Process Overview

### Phase 1: Style DNA Extraction

1. **Navigate** to style source website
2. **Extract** complete design system (colors, typography, spacing, patterns)
3. **Analyze** quality and identify improvement opportunities
4. **Normalize** tokens to modern standards

### Phase 2: Content & Brand Extraction

1. **Crawl** content source website comprehensively
2. **Extract** brand identity, messaging, and voice
3. **Map** information architecture and user flows
4. **Analyze** content patterns and conversion paths

### Phase 3: Intelligent Composition

1. **Merge** design tokens with brand requirements
2. **Resolve** conflicts between style and content needs
3. **Enhance** accessibility and performance automatically
4. **Generate** unified specification for generation

### Phase 4: Modern Website Generation

1. **Create** Next.js project with optimized configuration
2. **Generate** Tailwind CSS theme from design tokens
3. **Build** reusable component library from patterns
4. **Construct** pages using extracted content and layouts

### Phase 5: Quality Validation

1. **Test** accessibility compliance (WCAG AA)
2. **Validate** performance against Core Web Vitals
3. **Check** cross-browser compatibility
4. **Audit** design consistency and quality

## What Gets Transferred

### 🎨 Visual Design System

- **Color Palette**: Complete semantic color system
- **Typography Scale**: Modular type scale with optimal ratios
- **Spacing Grid**: Consistent spacing system (8px base preferred)
- **Component Patterns**: Reusable UI component designs
- **Layout Systems**: Grid structures and responsive breakpoints

### 📝 Content & Messaging

- **Brand Identity**: Company name, tagline, logo, colors
- **Content Strategy**: Page types, content categories, messaging
- **Information Architecture**: Site structure and navigation
- **Voice & Tone**: Writing style and brand personality

### ⚡ Performance & Accessibility

- **Core Web Vitals**: Optimized loading and interaction performance
- **WCAG AA Compliance**: Full accessibility implementation
- **Mobile Optimization**: Touch-friendly interfaces and responsive design
- **SEO Optimization**: Proper meta tags and structured data

## Output Structure

### Generated Files

```
output/
├── build-spec.json          # Unified specification
├── package.json             # Next.js project configuration
├── tailwind.config.js       # Generated theme configuration
├── next.config.js          # Next.js optimization settings
├── components/             # Reusable React components
│   ├── Navigation.js
│   ├── Hero.js
│   ├── Card.js
│   └── ...
├── pages/                  # Generated pages
│   ├── index.js
│   ├── about.js
│   └── ...
├── styles/                 # Global styles and utilities
│   └── globals.css
└── public/                 # Static assets
    └── ...
```

### Component Architecture

- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Design Tokens**: Centralized styling variables
- **Accessibility First**: ARIA labels, keyboard navigation, screen reader support
- **Performance Optimized**: Lazy loading, code splitting, optimized images

## Quality Enhancement

### Automatic Improvements

- **Color Contrast**: Ensures WCAG AA compliance (4.5:1 minimum)
- **Typography**: Optimizes line heights and spacing for readability
- **Spacing**: Normalizes to 8px grid system
- **Performance**: Implements modern loading strategies
- **Accessibility**: Adds missing ARIA labels and focus management

### Modern Standards

- **CSS Grid & Flexbox**: Modern layout techniques
- **Custom Properties**: CSS variables for theming
- **Progressive Enhancement**: Works without JavaScript
- **Mobile First**: Responsive design approach

## Configuration Options

### Style Influence Weight

- **0.0-0.3**: Minimal style influence, focus on content
- **0.4-0.6**: Balanced approach, moderate style adoption
- **0.7-1.0**: Strong style influence, comprehensive adoption

### Content Preservation

- **1.0**: Preserve all original content and structure
- **0.7-0.9**: Allow minor content restructuring for UX
- **0.0-0.6**: Significant content restructuring allowed

## Integration Examples

### With Existing Design Systems

```bash
# Extract from competitor and integrate with your brand
/style-transfer https://competitor.com https://mybrand.com --style-weight 0.4

# Modernize legacy design while keeping content
/style-transfer https://modernsite.com https://legacybrand.com --style-weight 0.8
```

### For Different Use Cases

```bash
# E-commerce redesign
/style-transfer https://shopify.com https://mystore.com --name ecommerce-redesign

# SaaS dashboard modernization
/style-transfer https://linear.app https://mysaas.com --name dashboard-upgrade

# Blog redesign
/style-transfer https://vercel.com https://myblog.com --name blog-modernization
```

## Quality Validation

### Automated Checks

- ✅ **Accessibility Score**: >95 (WCAG AA compliance)
- ✅ **Performance Score**: >90 (Lighthouse performance)
- ✅ **SEO Score**: >90 (Lighthouse SEO)
- ✅ **Design Consistency**: >85 (pattern adherence)

### Manual Review Points

- [ ] Brand voice preservation
- [ ] Content hierarchy maintenance
- [ ] User flow optimization
- [ ] Visual design coherence

## Error Handling

### Common Issues

- **Network Timeout**: Automatic retry with exponential backoff
- **Content Blocking**: Respect robots.txt and implement delays
- **Dynamic Content**: Wait for SPA loading and animations
- **Large Sites**: Implement crawling limits and depth control

### Fallback Strategies

- **Partial Extraction**: Continue with available content
- **Default Values**: Use sensible defaults for missing data
- **Graceful Degradation**: Ensure site works with reduced features

## Performance Considerations

### Extraction Phase

- Parallel processing of multiple viewports
- Smart caching of repeated assets
- Bandwidth-aware resource loading
- Configurable timeouts and limits

### Generation Phase

- Optimized bundle splitting
- Image optimization and lazy loading
- Critical CSS inlining
- Progressive loading strategies

## Security & Ethics

### Data Protection

- No extraction of personal information
- Respect for website privacy policies
- Secure handling of extracted data
- No persistent storage of sensitive content

### Website Impact

- Minimal server load with rate limiting
- Polite crawling with appropriate delays
- Resource-conscious extraction
- Compliance with website terms of service

## Troubleshooting

### Style Extraction Issues

- **Inconsistent Colors**: Use comprehensive extraction mode
- **Missing Typography**: Ensure fonts are web-accessible
- **Layout Complexity**: Simplify complex layouts automatically

### Content Integration Problems

- **Content Overflow**: Implement responsive text sizing
- **Brand Conflicts**: Manual review of merged elements
- **Navigation Issues**: Verify information architecture mapping

### Generation Errors

- **Build Failures**: Check Node.js version compatibility
- **Missing Dependencies**: Ensure all npm packages are installed
- **Asset Loading**: Verify public asset paths and formats

## Best Practices

### Style Source Selection

1. **Choose Exemplary Sites**: Select websites with strong design systems
2. **Consider Industry**: Match style source to target industry
3. **Evaluate Accessibility**: Prioritize accessible source designs
4. **Check Performance**: Select fast, well-optimized sources

### Content Preparation

1. **Clean Content**: Remove boilerplate and redundant information
2. **Structured Data**: Use proper headings and semantic HTML
3. **Asset Optimization**: Ensure images are web-optimized
4. **Content Strategy**: Have clear goals and user flows defined

### Quality Assurance

1. **Test Across Devices**: Mobile, tablet, desktop validation
2. **Browser Compatibility**: Chrome, Firefox, Safari, Edge
3. **Accessibility Testing**: Screen reader and keyboard navigation
4. **Performance Monitoring**: Core Web Vitals tracking

## Advanced Usage

### Multi-Source Blending

Combine styles from multiple sources:

```bash
# Blend design from two sources with different weights
/style-transfer "https://stripe.com,https://vercel.com" https://mycompany.com --style-weights "0.6,0.4"
```

### Custom Extraction Rules

Apply specific extraction parameters:

```bash
# Focus on specific sections
/style-transfer https://source.com https://target.com --selectors ".main-content,.hero-section"

# Use different viewports
/style-transfer https://source.com https://target.com --viewports "1920x1080,768x1024,375x667"
```

### Integration with CI/CD

Automate style transfer in deployment pipelines:

```yaml
# .github/workflows/style-transfer.yml
name: Style Transfer
on: [push, pull_request]
jobs:
  transfer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx style-transfer ${{ secrets.STYLE_SOURCE }} ${{ secrets.CONTENT_SOURCE }}
```

## Success Metrics

### Quality Metrics

- **Design Consistency**: >90% token adherence
- **Accessibility Score**: >95 WCAG AA compliance
- **Performance Score**: >90 Lighthouse performance
- **User Experience**: Positive feedback and engagement

### Process Metrics

- **Extraction Time**: <5 minutes for typical sites
- **Generation Time**: <2 minutes for standard sites
- **Validation Pass Rate**: >95% automated checks
- **Manual Review Time**: <15 minutes per site

## Support & Resources

### Documentation

- [Design Token Format](https://design-tokens.github.io/community-group/format/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Documentation](https://nextjs.org/docs)

### Tools & Dependencies

- **Playwright**: Browser automation for extraction
- **Next.js**: React framework for generation
- **Tailwind CSS**: Utility-first CSS framework
- **Lighthouse**: Performance and accessibility auditing

### Community & Examples

- [Style Transfer Gallery](https://github.com/web-style-transfer/gallery)
- [Design System Showcase](https://github.com/web-style-transfer/showcase)
- [Contributing Guide](https://github.com/web-style-transfer/contributing)

---

**Note**: This command generates production-ready websites but always review the output for brand consistency and make adjustments as needed for your specific use case.
