# S-Tier Design Principles

## Overview

This document outlines the comprehensive design principles that govern our web style transfer system. All extracted and regenerated websites must adhere to these S-tier standards for professional, accessible, and performant web experiences.

## Core Design Metrics

### Grid System

| Metric            | Value                  | Rationale                                                   |
| ----------------- | ---------------------- | ----------------------------------------------------------- |
| Base Grid Unit    | 8px                    | Ensures consistent spacing and alignment                    |
| Scale Multipliers | 1, 2, 3, 4, 5, 6, 7, 8 | Creates harmonious spacing: 8, 16, 24, 32, 40, 48, 56, 64px |
| Container Width   | 1200px max             | Optimal reading width, prevents excessive stretching        |
| Gutter Spacing    | 16px-32px              | Balanced whitespace between columns                         |

### Color Contrast Requirements

| Context            | Minimum Ratio | Preferred Ratio | WCAG Level |
| ------------------ | ------------- | --------------- | ---------- |
| Normal Text        | 4.5:1         | 7:1             | AA         |
| Large Text (18pt+) | 3:1           | 4.5:1           | AA         |
| UI Components      | 3:1           | 4.5:1           | AA         |
| Focus Indicators   | 3:1           | 4.5:1           | AA         |
| Non-text Content   | 3:1           | 4.5:1           | AA         |

### Typography Scale

| Scale         | Ratio   | Example Values                         | Usage                 |
| ------------- | ------- | -------------------------------------- | --------------------- |
| Modular Scale | 1.2     | 16px → 19.2px → 23px → 27.6px → 33.1px | Body text progression |
| Heading Scale | 1.25    | 32px → 40px → 50px → 62.5px → 78px     | H1 through H5         |
| Small Text    | 0.875   | 14px → 12px → 11px                     | Captions, labels      |
| Line Height   | 1.4-1.6 | 22.4px-25.6px for 16px text            | Optimal readability   |

### Animation & Motion

| Type                | Duration  | Easing      | Usage                           |
| ------------------- | --------- | ----------- | ------------------------------- |
| Micro-interactions  | 150ms     | ease-out    | Button hovers, toggles          |
| Page Transitions    | 300ms     | ease-in-out | Route changes, modal open/close |
| Loading States      | 500ms     | linear      | Progress bars, spinners         |
| Entrance Animations | 200-400ms | ease-out    | Element reveals, notifications  |

### Performance Budget

| Metric                   | Target | Warning | Failure |
| ------------------------ | ------ | ------- | ------- |
| First Contentful Paint   | <1.5s  | <2.5s   | >3s     |
| Largest Contentful Paint | <2.5s  | <4s     | >5s     |
| Cumulative Layout Shift  | <0.1   | <0.25   | >0.25   |
| Total Blocking Time      | <200ms | <600ms  | >1000ms |
| Bundle Size              | <500KB | <800KB  | >1MB    |

## Design Token Standards

### DTCG Compliance Format

All design tokens must follow the [Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) specification:

```json
{
  "color": {
    "primary": {
      "base": {
        "$value": "#0066cc",
        "$type": "color",
        "$description": "Primary brand color"
      },
      "hover": {
        "$value": "#0052a3",
        "$type": "color",
        "$description": "Primary color for interactive states"
      }
    }
  }
}
```

### Color System Structure

```json
{
  "color": {
    "brand": {
      "primary": { "$value": "#0066cc", "$type": "color" },
      "secondary": { "$value": "#6b7280", "$type": "color" },
      "accent": { "$value": "#f59e0b", "$type": "color" }
    },
    "neutral": {
      "50": { "$value": "#f9fafb", "$type": "color" },
      "100": { "$value": "#f3f4f6", "$type": "color" },
      "900": { "$value": "#111827", "$type": "color" }
    },
    "semantic": {
      "success": { "$value": "#10b981", "$type": "color" },
      "warning": { "$value": "#f59e0b", "$type": "color" },
      "error": { "$value": "#ef4444", "$type": "color" },
      "info": { "$value": "#3b82f6", "$type": "color" }
    }
  }
}
```

### Typography Token Structure

```json
{
  "typography": {
    "family": {
      "primary": {
        "$value": "Inter, system-ui, sans-serif",
        "$type": "fontFamily"
      },
      "monospace": {
        "$value": "JetBrains Mono, monospace",
        "$type": "fontFamily"
      }
    },
    "size": {
      "xs": { "$value": "0.75rem", "$type": "fontSize" },
      "sm": { "$value": "0.875rem", "$type": "fontSize" },
      "base": { "$value": "1rem", "$type": "fontSize" },
      "lg": { "$value": "1.125rem", "$type": "fontSize" },
      "xl": { "$value": "1.25rem", "$type": "fontSize" },
      "2xl": { "$value": "1.5rem", "$type": "fontSize" }
    },
    "weight": {
      "normal": { "$value": 400, "$type": "fontWeight" },
      "medium": { "$value": 500, "$type": "fontWeight" },
      "semibold": { "$value": 600, "$type": "fontWeight" },
      "bold": { "$value": 700, "$type": "fontWeight" }
    }
  }
}
```

## Accessibility Standards

### WCAG 2.1 AA Compliance Checklist

#### Perceivable

- [ ] **Text Alternatives**: All images have descriptive alt text
- [ ] **Time-based Media**: No auto-playing media without controls
- [ ] **Adaptable**: Content works without specific presentation
- [ ] **Distinguishable**: Sufficient color contrast and sensory characteristics

#### Operable

- [ ] **Keyboard Accessible**: All functionality available via keyboard
- [ ] **Enough Time**: No time limits that can't be extended
- [ ] **Seizures and Physical Reactions**: No content causes seizures
- [ ] **Navigable**: Clear navigation and heading structure

#### Understandable

- [ ] **Readable**: Clear, understandable text
- [ ] **Predictable**: Consistent navigation and behavior
- [ ] **Input Assistance**: Clear labels and error messages

#### Robust

- [ ] **Compatible**: Works with current and future assistive technologies
- [ ] **Parsing**: Valid HTML structure
- [ ] **Name, Role, Value**: Proper ARIA implementation

### Color Accessibility Guidelines

#### Color Contrast Requirements

```typescript
interface ColorContrastRequirements {
  normalText: {
    aa: 4.5; // WCAG AA standard
    aaa: 7.0; // WCAG AAA enhanced
  };
  largeText: {
    aa: 3.0; // 18pt+ or 14pt+ bold
    aaa: 4.5;
  };
  uiComponents: {
    minimum: 3.0;
    preferred: 4.5;
  };
}
```

#### Color Blindness Considerations

- Avoid red/green combinations for status indicators
- Use additional visual cues beyond color
- Test with color blindness simulators
- Maintain contrast when colors are removed

## Responsive Design Standards

### Breakpoint System

| Device  | Width         | Container | Columns | Gutters |
| ------- | ------------- | --------- | ------- | ------- |
| Mobile  | 320px-767px   | 100%      | 1       | 16px    |
| Tablet  | 768px-1023px  | 720px     | 2-3     | 24px    |
| Desktop | 1024px-1439px | 960px     | 3-4     | 32px    |
| Wide    | 1440px+       | 1200px    | 4-6     | 32px    |

### Fluid Typography

```css
/* Fluid typography scale */
html {
  font-size: clamp(14px, 2.5vw, 18px);
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
```

### Mobile-First Approach

```scss
// Mobile-first responsive design
.component {
  // Base mobile styles
  padding: 1rem;

  @media (min-width: 768px) {
    // Tablet styles
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    // Desktop styles
    padding: 2rem;
  }
}
```

## Component Design Standards

### Button Component Specifications

```typescript
interface ButtonVariants {
  primary: {
    background: 'brand.primary';
    color: 'neutral.50';
    hover: {
      background: 'brand.primary.hover';
      transform: 'translateY(-1px)';
    };
    focus: {
      outline: '2px solid brand.primary';
      outlineOffset: '2px';
    };
  };
  secondary: {
    background: 'transparent';
    border: '1px solid neutral.300';
    color: 'neutral.900';
  };
}
```

### Form Component Standards

- **Label Association**: All inputs have associated labels
- **Error States**: Clear error messages with color and text
- **Success States**: Positive feedback for completed fields
- **Focus Management**: Keyboard navigation between fields
- **Validation**: Real-time validation with helpful messages

### Card Component Guidelines

```typescript
interface CardDesign {
  padding: 'space.4'; // 16px
  borderRadius: 'radius.md'; // 8px
  boxShadow: 'shadow.sm'; // Subtle elevation
  hover: {
    transform: 'translateY(-2px)';
    boxShadow: 'shadow.md';
  };
}
```

## Performance Optimization Standards

### Image Optimization

```html
<!-- Modern responsive images -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img
    src="image.jpg"
    alt="Descriptive alt text"
    loading="lazy"
    decoding="async"
    width="800"
    height="600"
  />
</picture>
```

### CSS Optimization

```scss
// Critical CSS inlined
<style>
  /* Above-the-fold styles only */
  .hero { /* Critical styles */ }
</style>

<!-- Non-critical CSS loaded asynchronously -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### JavaScript Optimization

```javascript
// Code splitting with dynamic imports
const handleClick = async () => {
  const module = await import('./heavy-feature.js');
  module.initialize();
};

// Lazy loading for components
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

## Quality Assurance Metrics

### Design Quality Score Breakdown

| Category                 | Weight | Target Score | Description                    |
| ------------------------ | ------ | ------------ | ------------------------------ |
| Color Consistency        | 20%    | >0.85        | Harmonious color relationships |
| Typography Hierarchy     | 25%    | >0.90        | Clear text hierarchy           |
| Spacing Regularity       | 20%    | >0.80        | Consistent spacing patterns    |
| Accessibility Compliance | 15%    | >0.95        | WCAG 2.1 AA compliance         |
| Pattern Consistency      | 10%    | >0.75        | Reusable design patterns       |
| Performance Optimization | 5%     | >0.90        | Fast loading and interaction   |
| Modernity Score          | 5%     | >0.70        | Current design trends          |

### Automated Quality Checks

```typescript
interface QualityGates {
  colorContrast: {
    minimum: 4.5;
    automated: true;
  };
  performanceBudget: {
    fcp: 1500; // milliseconds
    lcp: 2500;
    cls: 0.1;
    automated: true;
  };
  accessibilityScore: {
    minimum: 95; // percentage
    automated: true;
  };
}
```

## Best Practices

### Do's ✅

- Use semantic HTML elements
- Implement proper heading hierarchy (H1→H2→H3...)
- Provide alternative text for images
- Ensure keyboard accessibility
- Test across multiple devices and browsers
- Use consistent spacing from the 8px grid
- Maintain color contrast ratios above 4.5:1
- Optimize images and assets for web
- Use modern CSS features with fallbacks
- Document design decisions and rationale

### Don'ts ❌

- Don't use color alone to convey meaning
- Don't create fixed widths that don't adapt to content
- Don't ignore focus states for interactive elements
- Don't use images of text
- Don't rely on JavaScript for critical functionality
- Don't create layouts that require horizontal scrolling
- Don't use font sizes below 14px for body text
- Don't ignore loading states and error handling
- Don't break established design patterns without reason
- Don't optimize for aesthetics at the expense of usability

## Implementation Checklist

### Pre-Development

- [ ] Design tokens created and validated
- [ ] Color contrast ratios verified
- [ ] Typography scale established
- [ ] Component specifications documented
- [ ] Accessibility requirements reviewed

### Development

- [ ] Semantic HTML structure implemented
- [ ] Responsive breakpoints applied
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified
- [ ] Performance budget monitored

### Quality Assurance

- [ ] Cross-browser testing completed
- [ ] Accessibility audit passed
- [ ] Performance metrics within budget
- [ ] Design consistency validated
- [ ] Code review completed

### Deployment

- [ ] Assets optimized and compressed
- [ ] CDN configuration verified
- [ ] Monitoring and analytics implemented
- [ ] Documentation updated
- [ ] Stakeholder approval obtained

This comprehensive framework ensures that all websites generated by our style transfer system meet professional S-tier standards for design, accessibility, performance, and user experience.
