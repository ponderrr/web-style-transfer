---
command: build-site
description: Generate a complete modern website from unified specification
parameters:
  - spec-path: Path to unified specification JSON file
  - output: Output directory for generated site (optional, defaults to ./output/generated-site)
  - framework: Target framework (optional, nextjs|react|vue|svelte, defaults to nextjs)
  - styling: Styling approach (optional, tailwind|styled-components|css-modules, defaults to tailwind)
  - theme: Color theme preset (optional, light|dark|auto, defaults to light)
  - optimize: Enable performance optimizations (optional, default: true)
---

Generates a complete, production-ready website from a unified specification that combines design tokens, content, and brand identity into a modern, accessible, and performant web application.

## Usage Examples

```
/build-site specs/unified-spec.json
/build-site specs/composed/build-spec.json --output ./my-website --framework nextjs
/build-site specs/composed/spec.json --styling tailwind --theme dark
/build-site specs/composed/spec.json --framework react --optimize false
```

## Process Overview

### Phase 1: Specification Analysis

1. **Load** unified specification from JSON file
2. **Validate** specification structure and completeness
3. **Analyze** design tokens, patterns, and content requirements
4. **Assess** quality standards and compliance requirements

### Phase 2: Project Initialization

1. **Create** project structure based on selected framework
2. **Generate** package.json with required dependencies
3. **Set up** build configuration and optimization settings
4. **Initialize** theme system and design token integration

### Phase 3: Component Generation

1. **Extract** component specifications from patterns
2. **Generate** reusable React/Vue/Svelte components
3. **Implement** accessibility features and ARIA support
4. **Create** component variants and responsive behavior

### Phase 4: Page Construction

1. **Map** content to generated components
2. **Build** page layouts using extracted patterns
3. **Implement** navigation and routing structure
4. **Integrate** brand elements and messaging

### Phase 5: Theme & Styling

1. **Generate** Tailwind configuration from design tokens
2. **Create** CSS custom properties for theme variables
3. **Implement** dark mode support if requested
4. **Set up** responsive breakpoints and grid system

### Phase 6: Optimization & Validation

1. **Optimize** images and static assets
2. **Implement** performance optimizations
3. **Validate** accessibility compliance
4. **Run** automated quality checks

## Supported Frameworks

### Next.js (Default)

- **App Router**: Modern Next.js 13+ with App Router
- **Server Components**: Optimized server and client components
- **Image Optimization**: Built-in Next.js Image component
- **SEO Optimization**: Automatic meta tag generation

### React (Standalone)

- **Create React App**: Traditional CRA setup
- **Vite**: Modern Vite-based React application
- **Component Library**: Reusable component architecture
- **Router Integration**: React Router for navigation

### Vue.js

- **Vue 3**: Composition API with modern Vue features
- **Nuxt.js**: Full-stack Vue framework option
- **Component System**: Vue SFC (Single File Components)
- **State Management**: Pinia for complex applications

### Svelte

- **Svelte 4**: Modern Svelte with runes
- **SvelteKit**: Full-stack Svelte framework
- **Component Architecture**: Svelte's reactive components
- **Performance**: Optimized compilation

## Styling Approaches

### Tailwind CSS (Default)

- **Utility-First**: Atomic CSS classes for rapid development
- **Design Tokens**: Automatic token-to-Tailwind conversion
- **Responsive Design**: Mobile-first responsive utilities
- **Customization**: Custom theme generation from tokens

### Styled Components

- **CSS-in-JS**: Component-scoped styling
- **Theme Provider**: Centralized theme management
- **Dynamic Styling**: Props-based style variations
- **SSR Support**: Server-side rendering compatibility

### CSS Modules

- **Scoped Styles**: Isolated component stylesheets
- **Build Integration**: Webpack/CSS Module processing
- **Type Safety**: TypeScript integration for styles
- **Performance**: Optimized CSS bundling

## Output Structure

### Next.js Application

```
generated-site/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout with theme provider
│   ├── page.js            # Homepage
│   ├── about/             # About page
│   │   └── page.js
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Input.js
│   ├── layout/           # Layout components
│   │   ├── Header.js
│   │   ├── Navigation.js
│   │   └── Footer.js
│   └── sections/         # Page sections
│       ├── Hero.js
│       ├── Features.js
│       └── Testimonials.js
├── lib/                   # Utility libraries
│   ├── utils.js          # Utility functions
│   ├── theme.js          # Theme configuration
│   └── constants.js      # Application constants
├── public/               # Static assets
│   ├── images/
│   └── favicon.ico
├── styles/               # Additional stylesheets
│   ├── components.css
│   └── animations.css
├── tailwind.config.js    # Generated Tailwind config
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Generated documentation
```

### Component Architecture

- **Atomic Design**: Organized component hierarchy
- **Design Tokens**: Centralized styling variables
- **Accessibility**: WCAG AA compliant components
- **Performance**: Optimized rendering and loading

## Design Token Integration

### Color System

```javascript
// Generated Tailwind Config
module.exports = {
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ... complete scale
        900: '#1e3a8a',
      },
      secondary: {
        // ... secondary color scale
      },
      // ... semantic colors
    },
  },
};
```

### Typography Scale

```javascript
// Generated Typography
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    // ... complete scale
  },
};
```

### Spacing & Layout

```javascript
// Generated Spacing
const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  4: '1rem',
  8: '2rem',
  // ... 8px grid system
};
```

## Component Generation

### Pattern-Based Components

- **Navigation**: Header, sidebar, mobile menu patterns
- **Hero Sections**: Landing page layouts with CTAs
- **Content Cards**: Article previews and feature cards
- **Forms**: Contact forms, newsletter signup, search
- **Interactive Elements**: Buttons, links, accordions

### Accessibility Features

- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant colors
- **Touch Targets**: Mobile-friendly sizing (44px minimum)

### Responsive Design

- **Mobile First**: Progressive enhancement approach
- **Breakpoint System**: Configurable responsive breakpoints
- **Grid System**: Flexible layout grids
- **Touch Optimization**: Mobile-specific interactions

## Performance Optimizations

### Automatic Optimizations

- **Image Optimization**: WebP format with lazy loading
- **Code Splitting**: Route-based and component splitting
- **Bundle Analysis**: Optimized chunk sizes
- **Critical CSS**: Above-the-fold styling optimization

### Loading Strategies

- **Progressive Loading**: Content appears as it loads
- **Skeleton Screens**: Loading state placeholders
- **Resource Hints**: Preload and prefetch optimization
- **Caching Strategy**: Service worker for offline support

## Quality Validation

### Automated Checks

- ✅ **Build Success**: No compilation errors
- ✅ **TypeScript**: Type safety validation
- ✅ **ESLint**: Code quality standards
- ✅ **Accessibility**: Automated a11y testing
- ✅ **Performance**: Lighthouse performance audit
- ✅ **SEO**: Meta tags and structured data validation

### Quality Gates

- **Bundle Size**: <500KB for initial load
- **Lighthouse Score**: >90 for all categories
- **Accessibility Score**: >95 WCAG AA compliance
- **Performance Score**: >90 Core Web Vitals

## Configuration Options

### Framework-Specific Settings

```json
{
  "framework": {
    "nextjs": {
      "appRouter": true,
      "imageOptimization": true,
      "staticOptimization": true
    }
  }
}
```

### Styling Configuration

```json
{
  "styling": {
    "tailwind": {
      "customTheme": true,
      "darkMode": "class",
      "plugins": ["typography", "forms"]
    }
  }
}
```

### Build Optimization

```json
{
  "optimization": {
    "minify": true,
    "compress": true,
    "preload": true,
    "analyze": false
  }
}
```

## Customization Examples

### E-commerce Site

```bash
/build-site specs/ecommerce-spec.json --framework nextjs --styling tailwind
# Generates: Product pages, cart, checkout, admin dashboard
```

### Blog/CMS Site

```bash
/build-site specs/blog-spec.json --framework nextjs --optimize true
# Generates: Article pages, categories, author profiles, search
```

### SaaS Dashboard

```bash
/build-site specs/saas-spec.json --framework react --styling styled-components
# Generates: Dashboard, settings, user management, analytics
```

### Portfolio Site

```bash
/build-site specs/portfolio-spec.json --framework svelte --theme dark
# Generates: Project showcase, about page, contact form
```

## Error Handling

### Build Failures

- **Dependency Issues**: Automatic dependency resolution
- **Type Errors**: TypeScript error reporting and fixes
- **Asset Loading**: Fallback handling for missing assets
- **Configuration Errors**: Validation with helpful error messages

### Runtime Issues

- **Hydration Errors**: Server/client mismatch handling
- **Routing Errors**: 404 page generation and handling
- **Performance Issues**: Bundle size optimization warnings

## Deployment Ready

### Optimized for Platforms

- **Vercel**: Zero-config deployment with Next.js
- **Netlify**: Static site generation support
- **AWS Amplify**: Full-stack deployment option
- **Railway**: Docker-based deployment
- **DigitalOcean App Platform**: Managed deployment

### Environment Configuration

```bash
# Production build
npm run build

# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Integration Features

### CMS Integration

- **Contentful**: Headless CMS integration
- **Strapi**: API-first CMS support
- **Sanity**: Real-time content editing
- **Prismic**: Slice-based content management

### Analytics Integration

- **Google Analytics**: Automatic GA4 setup
- **Mixpanel**: Event tracking integration
- **Hotjar**: Heatmap and feedback integration
- **Amplitude**: Product analytics support

### Performance Monitoring

- **Core Web Vitals**: Real user monitoring
- **Lighthouse CI**: Automated performance testing
- **Web Vitals**: User-centric performance metrics
- **Real User Monitoring**: Performance insights

## Troubleshooting

### Common Issues

- **Build Errors**: Check Node.js version compatibility
- **Styling Issues**: Verify Tailwind configuration
- **Component Errors**: Check prop types and required fields
- **Performance Issues**: Analyze bundle size and optimize images

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run build

# Analyze bundle size
npm run build --analyze

# Check TypeScript errors
npm run type-check
```

## Best Practices

### Development Workflow

1. **Specification First**: Start with comprehensive spec
2. **Component-Driven**: Build reusable component library
3. **Design Token Integration**: Use tokens for consistency
4. **Accessibility First**: Implement a11y from the start
5. **Performance Testing**: Regular performance audits

### Quality Assurance

1. **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
2. **Mobile Testing**: iOS Safari, Chrome Mobile
3. **Accessibility Testing**: Screen readers, keyboard navigation
4. **Performance Testing**: Lighthouse, Web Vitals

### Deployment Checklist

- [ ] Build passes without errors
- [ ] All accessibility checks pass
- [ ] Performance meets targets
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] SEO optimization implemented

## Advanced Features

### Multi-tenant Support

- **Theme Switching**: Dynamic theme loading
- **Brand Customization**: Runtime brand switching
- **Content Localization**: Multi-language support
- **Feature Flags**: Conditional feature loading

### Progressive Web App

- **Service Worker**: Offline functionality
- **Web App Manifest**: Installable PWA
- **Push Notifications**: User engagement features
- **Background Sync**: Offline data synchronization

### Advanced Optimization

- **Edge Computing**: Global CDN deployment
- **Image Optimization**: Automatic format selection
- **Critical Path**: Above-the-fold optimization
- **Bundle Optimization**: Intelligent code splitting

## Success Metrics

### Quality Metrics

- **Build Success Rate**: >99% successful builds
- **Performance Score**: >90 Lighthouse performance
- **Accessibility Score**: >95 WCAG AA compliance
- **SEO Score**: >90 Lighthouse SEO

### User Experience

- **Loading Speed**: <3 seconds initial load
- **Interaction Response**: <100ms for interactions
- **Accessibility Compliance**: 100% WCAG AA compliance
- **Cross-browser Support**: All modern browsers

## Support & Resources

### Documentation

- [Next.js Guide](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

### Community

- [Next.js Community](https://nextjs.org/community)
- [Tailwind Community](https://tailwindcss.com/community)
- [Web.dev Community](https://web.dev/community)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Wave Accessibility](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/)

---

**Note**: Generated websites are production-ready but should be reviewed for brand consistency and customized for specific business requirements.
