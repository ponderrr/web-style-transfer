---
command: compose-spec
description: Merge style extraction and brand extraction into unified build specification
parameters:
  - style-path: Path to style extraction results JSON file
  - brand-path: Path to brand extraction results JSON file
  - output: Output path for unified specification (optional, defaults to specs/composed/build-spec.json)
  - enhance: Enable intelligent design enhancements (optional, default: true)
  - validate: Run validation checks on merged specification (optional, default: true)
  - quality-gate: Minimum quality score threshold (optional, 0-1, default: 0.7)
---

Combines extracted design tokens and brand identity into a unified specification that can be used to generate modern, accessible websites. This is the intelligence layer that resolves conflicts between design and content requirements while enhancing quality standards.

## Usage Examples

```
/compose-spec specs/tokens/design-tokens.json specs/content/site-content.json
/compose-spec specs/tokens/stripe-design.json specs/content/company-brand.json --output specs/composed/merged-spec.json
/compose-spec specs/extracted/style.json specs/extracted/brand.json --enhance true --validate true
/compose-spec specs/style.json specs/brand.json --quality-gate 0.8 --output ./build/spec.json
```

## Process Overview

### Phase 1: Input Validation

1. **Load** style extraction results (tokens, patterns, quality scores)
2. **Load** brand extraction results (identity, content, architecture)
3. **Validate** both inputs for completeness and compatibility
4. **Check** quality gates and extraction integrity

### Phase 2: Intelligent Merging

1. **Resolve Conflicts**: Handle design vs content requirements
2. **Merge Tokens**: Combine color, typography, spacing systems
3. **Unify Patterns**: Align UI patterns with brand requirements
4. **Harmonize Messaging**: Integrate brand voice with design system

### Phase 3: Quality Enhancement

1. **Apply Standards**: Enforce S-Tier design principles
2. **Fix Accessibility**: Automatically resolve WCAG issues
3. **Optimize Performance**: Enhance loading and interaction performance
4. **Modernize Patterns**: Update legacy patterns to current standards

### Phase 4: Specification Generation

1. **Create Framework**: Build Next.js/React/Vue specification
2. **Generate Components**: Define reusable component library
3. **Map Content**: Structure pages and content flow
4. **Configure Theme**: Set up design token integration

### Phase 5: Validation & Optimization

1. **Quality Audit**: Final quality score assessment
2. **Accessibility Check**: WCAG AA compliance validation
3. **Performance Review**: Core Web Vitals optimization
4. **Cross-browser Testing**: Compatibility verification

## Input Requirements

### Style Extraction (Required)

```json
{
  "url": "https://source-website.com",
  "tokens": {
    "colors": {
      /* Design tokens */
    },
    "typography": {
      /* Type scale */
    },
    "spacing": {
      /* Spacing system */
    },
    "effects": {
      /* Shadows, transitions */
    }
  },
  "patterns": [
    {
      "type": "navigation",
      "confidence": 0.95,
      "properties": {
        /* Pattern details */
      }
    }
  ],
  "qualityScore": {
    "overall": 0.87,
    "breakdown": {
      /* Detailed scores */
    }
  }
}
```

### Brand Extraction (Required)

```json
{
  "url": "https://brand-website.com",
  "brand": {
    "name": "Company Name",
    "tagline": "Brand tagline",
    "colors": ["#brand-color"],
    "voice": "brand-voice-description"
  },
  "contentInventory": {
    "pages": [
      /* Page content */
    ],
    "topics": [
      /* Content categories */
    ]
  },
  "informationArchitecture": {
    "navigation": [
      /* Site structure */
    ],
    "routes": [
      /* URL patterns */
    ]
  }
}
```

## Output Specification

### Unified Build Specification

```json
{
  "version": "1.0",
  "source": {
    "styleUrl": "https://source-website.com",
    "brandUrl": "https://brand-website.com",
    "extractedAt": "2024-01-01T00:00:00Z",
    "extractorVersion": "1.0.0",
    "enhancementApplied": true
  },
  "design": {
    "tokens": {
      "colors": {
        /* Merged color system */
      },
      "typography": {
        /* Unified type scale */
      },
      "spacing": {
        /* Normalized spacing */
      },
      "effects": {
        /* Enhanced effects */
      },
      "breakpoints": {
        /* Responsive breakpoints */
      },
      "borderRadius": {
        /* Consistent rounding */
      }
    },
    "patterns": [
      {
        "type": "navigation",
        "variant": "enhanced",
        "properties": {
          /* Enhanced properties */
        },
        "accessibility": {
          /* A11y features */
        }
      }
    ],
    "quality": {
      "overall": 0.92,
      "breakdown": {
        /* Enhanced scores */
      },
      "recommendations": [
        /* Improvement suggestions */
      ]
    }
  },
  "brand": {
    "profile": {
      "name": "Company Name",
      "tagline": "Enhanced tagline",
      "mission": "Company mission",
      "values": ["core values"],
      "personality": ["brand traits"]
    },
    "content": {
      "pages": [
        /* Enhanced content */
      ],
      "types": ["content categories"],
      "voice": "refined brand voice"
    },
    "seo": {
      "title": "Optimized title",
      "description": "Enhanced description",
      "keywords": ["optimized keywords"]
    },
    "messaging": {
      "tone": "consistent tone",
      "style": "refined style",
      "guidelines": ["voice guidelines"]
    }
  },
  "architecture": {
    "navigation": [
      /* Enhanced navigation */
    ],
    "routes": [
      /* Optimized routes */
    ],
    "userFlows": [
      /* Conversion paths */
    ]
  },
  "generation": {
    "framework": "nextjs",
    "styling": "tailwind",
    "components": {
      "navigation": {
        /* Component spec */
      },
      "hero": {
        /* Component spec */
      },
      "cards": {
        /* Component spec */
      }
    },
    "pages": [
      {
        "path": "/",
        "title": "Homepage",
        "sections": ["hero", "features", "cta"],
        "seo": {
          /* Page SEO */
        }
      }
    ],
    "assets": {
      "images": [
        /* Required images */
      ],
      "fonts": [
        /* Font requirements */
      ],
      "icons": [
        /* Icon requirements */
      ]
    },
    "build": {
      "output": "./output",
      "optimization": {
        "minify": true,
        "compress": true,
        "preload": true
      }
    }
  },
  "validation": {
    "accessibility": {
      "wcagLevel": "AA",
      "minScore": 0.95,
      "automated": true,
      "checks": ["color-contrast", "keyboard-nav", "screen-reader"]
    },
    "performance": {
      "lighthouse": {
        "performance": 90,
        "accessibility": 95,
        "bestPractices": 90,
        "seo": 90,
        "pwa": 50
      },
      "metrics": {
        "fcp": 1800,
        "lcp": 2500,
        "tti": 3800,
        "tbt": 300,
        "cls": 0.1,
        "speedIndex": 3400
      }
    },
    "seo": {
      "score": 90,
      "checks": ["meta-tags", "structured-data", "canonical-urls"]
    },
    "responsive": {
      "breakpoints": ["375px", "768px", "1024px", "1440px"],
      "devices": ["mobile", "tablet", "desktop"],
      "orientation": ["portrait", "landscape"]
    },
    "crossBrowser": {
      "browsers": ["chrome", "firefox", "safari", "edge"],
      "versions": ["latest-2", "latest-1", "latest"]
    }
  },
  "metadata": {
    "created": "2024-01-01T00:00:00Z",
    "updated": "2024-01-01T00:00:00Z",
    "author": "Web Style Transfer",
    "license": "MIT",
    "version": "1.0.0",
    "qualityScore": 0.92
  }
}
```

## Enhancement Features

### Intelligent Design Improvements

- **Color System Enhancement**: Merge brand colors with design palette
- **Typography Optimization**: Refine type scale for better readability
- **Spacing Normalization**: Convert to consistent 8px grid system
- **Pattern Enhancement**: Modernize legacy UI patterns

### Accessibility Automation

- **Color Contrast**: Ensure WCAG AA compliance (4.5:1 minimum)
- **Focus Management**: Add visible focus indicators
- **ARIA Labels**: Generate missing accessibility labels
- **Keyboard Navigation**: Ensure full keyboard accessibility

### Performance Optimization

- **Bundle Analysis**: Optimize component chunk sizes
- **Image Optimization**: Specify optimal image formats
- **Loading Strategies**: Implement progressive loading
- **Caching Strategy**: Define optimal caching headers

## Conflict Resolution

### Design vs Brand Conflicts

1. **Color Preferences**: When brand colors conflict with design system
   - **Solution**: Create harmonious color palette that respects both
   - **Fallback**: Use brand colors as primary, design colors as secondary

2. **Typography Choices**: When brand fonts differ from design fonts
   - **Solution**: Integrate brand fonts into design system
   - **Fallback**: Use design fonts with brand font as accent

3. **Spacing Systems**: When brand spacing differs from design grid
   - **Solution**: Normalize to 8px grid while preserving brand rhythm
   - **Fallback**: Use design grid with brand spacing exceptions

### Content vs Design Conflicts

1. **Layout Requirements**: When content needs differ from design patterns
   - **Solution**: Adapt patterns to content needs while maintaining consistency
   - **Fallback**: Create custom layouts for unique content types

2. **Component Usage**: When content doesn't fit standard components
   - **Solution**: Extend component library with content-specific variants
   - **Fallback**: Use flexible container components

## Quality Enhancement Pipeline

### Automatic Improvements

1. **Color Contrast Enhancement**

   ```javascript
   // Before: Low contrast colors
   const colors = { text: '#666', background: '#fff' };

   // After: Enhanced contrast
   const enhanced = {
     text: '#1a1a1a', // Improved contrast
     textSecondary: '#666', // Added secondary option
   };
   ```

2. **Typography Scale Optimization**

   ```javascript
   // Before: Inconsistent scale
   const scale = { h1: '2rem', h2: '1.5rem', body: '1rem' };

   // After: Modular scale
   const enhanced = {
     h1: '2.25rem', // 9:4 ratio
     h2: '1.5rem', // 2:3 ratio
     h3: '1.125rem', // 3:4 ratio
     body: '1rem', // Base size
     small: '0.875rem', // 7:8 ratio
   };
   ```

3. **Spacing System Normalization**

   ```javascript
   // Before: Random spacing
   const spacing = ['4px', '8px', '12px', '24px', '48px'];

   // After: 8px grid system
   const enhanced = {
     1: '0.25rem', // 4px
     2: '0.5rem', // 8px
     3: '0.75rem', // 12px
     6: '1.5rem', // 24px
     12: '3rem', // 48px
   };
   ```

## Component Specification Generation

### Pattern-to-Component Mapping

```json
{
  "input": {
    "type": "navigation",
    "confidence": 0.95,
    "properties": {
      "layout": "horizontal",
      "items": ["Home", "About", "Contact"],
      "hasLogo": true,
      "mobileMenu": true
    }
  },
  "output": {
    "component": "Navigation",
    "props": {
      "variant": "header",
      "items": [
        { "label": "Home", "href": "/" },
        { "label": "About", "href": "/about" },
        { "label": "Contact", "href": "/contact" }
      ],
      "logo": { "src": "/logo.png", "alt": "Company Logo" },
      "mobileMenu": true
    },
    "accessibility": {
      "ariaLabel": "Main navigation",
      "skipLink": true,
      "keyboardNavigation": true
    }
  }
}
```

### Content-to-Page Mapping

```json
{
  "input": {
    "path": "/about",
    "title": "About Us",
    "content": {
      "hero": {
        "heading": "About Our Company",
        "subheading": "Learn more about our mission",
        "image": "/about-hero.jpg"
      },
      "sections": [
        {
          "type": "text",
          "content": "Company story..."
        },
        {
          "type": "team",
          "members": [...]
        }
      ]
    }
  },
  "output": {
    "path": "/about",
    "title": "About Us | Company Name",
    "seo": {
      "description": "Learn about our company mission and team",
      "keywords": ["about", "company", "mission"]
    },
    "sections": [
      {
        "type": "Hero",
        "props": {
          "title": "About Our Company",
          "subtitle": "Learn more about our mission",
          "backgroundImage": "/about-hero.jpg"
        }
      },
      {
        "type": "ContentSection",
        "props": {
          "content": "Company story..."
        }
      },
      {
        "type": "TeamSection",
        "props": {
          "members": [...]
        }
      }
    ]
  }
}
```

## Validation & Quality Gates

### Automated Quality Checks

- ✅ **Specification Validity**: JSON schema compliance
- ✅ **Design Token Integrity**: Token format and completeness
- ✅ **Brand Consistency**: Brand element alignment
- ✅ **Accessibility Compliance**: WCAG AA requirement coverage
- ✅ **Performance Requirements**: Core Web Vitals compatibility
- ✅ **Cross-browser Compatibility**: Browser support validation

### Quality Scoring

```json
{
  "overall": 0.89,
  "breakdown": {
    "designConsistency": 0.92,
    "brandIntegration": 0.85,
    "accessibilityCompliance": 0.94,
    "performanceOptimization": 0.91,
    "contentStructure": 0.86,
    "technicalImplementation": 0.88
  },
  "thresholds": {
    "excellent": 0.9,
    "good": 0.8,
    "acceptable": 0.7
  },
  "recommendations": [
    "Improve brand color integration with design system",
    "Enhance content structure for better SEO",
    "Add more semantic HTML elements for accessibility"
  ]
}
```

## Configuration Options

### Enhancement Settings

```json
{
  "enhancement": {
    "colorSystem": {
      "mergeStrategy": "harmonize",
      "contrastBoost": true,
      "semanticRoles": true
    },
    "typography": {
      "scaleOptimization": true,
      "readabilityEnhancement": true,
      "fallbackFonts": true
    },
    "spacing": {
      "gridSystem": "8px",
      "normalization": true,
      "responsive": true
    },
    "accessibility": {
      "wcagLevel": "AA",
      "autoFix": true,
      "colorContrast": true,
      "focusManagement": true
    }
  }
}
```

### Validation Settings

```json
{
  "validation": {
    "strict": false,
    "qualityGate": 0.7,
    "accessibility": {
      "wcagLevel": "AA",
      "colorContrast": true,
      "keyboardNavigation": true,
      "screenReader": true
    },
    "performance": {
      "coreWebVitals": true,
      "bundleSize": true,
      "imageOptimization": true
    },
    "seo": {
      "metaTags": true,
      "structuredData": true,
      "canonicalUrls": true
    }
  }
}
```

## Error Handling

### Input Validation Errors

- **Missing Style Data**: Clear error with extraction guidance
- **Incomplete Brand Data**: Suggestions for additional extraction
- **Format Incompatibility**: Automatic format conversion attempts
- **Quality Gate Failure**: Detailed improvement recommendations

### Enhancement Errors

- **Token Conflicts**: Automatic conflict resolution with logging
- **Pattern Inconsistencies**: Pattern harmonization with warnings
- **Accessibility Issues**: Automatic fixes with fallback options
- **Performance Problems**: Optimization suggestions and alternatives

### Output Validation Errors

- **Schema Violations**: Detailed error locations and corrections
- **Missing Requirements**: Clear guidance on required elements
- **Integration Issues**: Compatibility warnings and workarounds

## Troubleshooting

### Common Issues

- **Style-Brand Conflicts**: Use `--enhance true` for intelligent resolution
- **Low Quality Scores**: Review source extraction quality first
- **Missing Components**: Ensure comprehensive pattern extraction
- **Performance Issues**: Enable optimization flags

### Debug Mode

```bash
# Enable detailed logging
DEBUG=* /compose-spec style.json brand.json

# Skip enhancements for debugging
/compose-spec style.json brand.json --enhance false

# Strict validation mode
/compose-spec style.json brand.json --validate true --quality-gate 0.9
```

## Best Practices

### Input Preparation

1. **Quality First**: Ensure high-quality extraction results as input
2. **Complete Coverage**: Extract both style and brand from same source when possible
3. **Consistency Check**: Verify brand consistency across extracted data
4. **Content Structure**: Ensure well-structured content for mapping

### Enhancement Strategy

1. **Balanced Approach**: Don't over-enhance to preserve brand identity
2. **Accessibility Priority**: Always prioritize accessibility improvements
3. **Performance Focus**: Optimize for real user performance metrics
4. **Scalability**: Ensure enhancements work across different content types

### Validation Approach

1. **Progressive Quality**: Set appropriate quality gates for project needs
2. **Comprehensive Testing**: Test across different browsers and devices
3. **User-Centric Validation**: Focus on user experience and accessibility
4. **Continuous Monitoring**: Track quality metrics over time

## Success Metrics

### Composition Quality

- **Merge Success Rate**: >95% successful merges
- **Enhancement Adoption**: >80% automatic improvements applied
- **Quality Score Improvement**: Average 15% quality score increase
- **Accessibility Compliance**: 100% WCAG AA compliance achievement

### Process Efficiency

- **Composition Time**: <30 seconds for typical specifications
- **Validation Speed**: <10 seconds for quality checks
- **Error Rate**: <5% composition failures
- **User Satisfaction**: >90% positive user feedback

## Integration with Workflow

### Development Pipeline

```yaml
# CI/CD Integration
name: Compose Specification
on: [push, pull_request]
jobs:
  compose:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Extract Style
        run: npm run extract:style
      - name: Extract Brand
        run: npm run extract:brand
      - name: Compose Specification
        run: npm run compose
      - name: Validate Quality
        run: npm run validate:all
```

### Design System Integration

```javascript
// Integration with design tools
import { composeSpec } from 'web-style-transfer';

const specification = await composeSpec({
  style: './specs/tokens/design-tokens.json',
  brand: './specs/content/site-content.json',
  options: {
    enhance: true,
    validate: true,
    qualityGate: 0.8,
  },
});

// Export to design tools
exportToFigma(specification);
exportToStorybook(specification);
exportToTailwindConfig(specification);
```

## Advanced Features

### Multi-Source Composition

- **Style Blending**: Combine multiple design systems
- **Brand Integration**: Merge multiple brand identities
- **Content Aggregation**: Combine content from multiple sources
- **Weighted Composition**: Control influence of different sources

### Intelligent Optimization

- **A/B Testing**: Generate variations for testing
- **Personalization**: Create user-specific compositions
- **Localization**: Adapt for different markets and languages
- **Progressive Enhancement**: Generate multiple quality levels

### Analytics Integration

- **Quality Tracking**: Monitor composition quality over time
- **Performance Metrics**: Track generation and validation performance
- **User Feedback**: Collect feedback on generated specifications
- **Improvement Recommendations**: Learn from successful compositions

## Support & Resources

### Documentation

- [Specification Format](https://github.com/web-style-transfer/spec-format)
- [Design Token Standards](https://design-tokens.github.io/community-group/format/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

### Community

- [GitHub Discussions](https://github.com/web-style-transfer/discussions)
- [Discord Community](https://discord.gg/web-style-transfer)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/web-style-transfer)

### Examples

- [Composition Gallery](https://github.com/web-style-transfer/gallery)
- [Case Studies](https://github.com/web-style-transfer/case-studies)
- [Templates](https://github.com/web-style-transfer/templates)

---

**Note**: The composition process is designed to be intelligent and preserve the best of both design and brand while creating a cohesive, high-quality specification for modern web development.
