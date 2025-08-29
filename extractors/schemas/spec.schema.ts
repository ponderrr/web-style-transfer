// Spec Schema
// extractors/schemas/spec.schema.ts

import { DesignTokens, QualityScore, AccessibilityReport, PerformanceReport } from './style.schema';
import {
  BrandProfile,
  ContentInventory,
  InformationArchitecture,
  SEOMetadata,
} from './brand.schema';

// Source information
export interface SourceInfo {
  styleUrl: string;
  brandUrl: string;
  extractedAt: string;
  extractorVersion?: string;
  qualityScores?: {
    style: number;
    brand: number;
    overall: number;
  };
}

// Design specification
export interface DesignSpec {
  tokens: DesignTokens;
  patterns: UIPattern[];
  quality: QualityScore;
  accessibility?: AccessibilityReport;
  performance?: PerformanceReport;
  guidelines?: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    spacing: Record<string, string>;
    components: Record<string, string>;
  };
}

// Brand specification
export interface BrandSpec {
  profile: BrandProfile;
  content: ContentInventory;
  architecture: InformationArchitecture;
  seo: SEOMetadata;
  messaging?: MessagingSpec;
}

// Component specification
export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  styles: Record<string, string>;
  responsive?: Record<string, any>;
  accessibility?: Record<string, any>;
}

export interface ComponentSpec {
  name: string;
  type: 'atom' | 'molecule' | 'organism' | 'template' | 'page';
  description?: string;
  variants: ComponentVariant[];
  props: Record<string, any>;
  styles: Record<string, string>;
  accessibility: {
    roles?: string[];
    labels?: string[];
    keyboard?: string[];
    screenReader?: string[];
    aria?: Record<string, string>;
  };
  responsive: {
    breakpoints: string[];
    behaviors: Record<string, string>;
    grid?: {
      columns: Record<string, number>;
      gaps: Record<string, string>;
    };
  };
  interactions?: InteractionSpec[];
  dependencies?: string[];
  usage?: string;
}

// Page specification
export interface PageSpec {
  path: string;
  name: string;
  title: string;
  description?: string;
  components: ComponentUsage[];
  layout: {
    type: 'full-width' | 'contained' | 'split' | 'grid';
    container?: string;
    padding?: Record<string, string>;
    background?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    structuredData?: Record<string, any>;
  };
  performance?: {
    priority: 'high' | 'medium' | 'low';
    preload?: string[];
    prefetch?: string[];
  };
}

// Component Usage Examples and Patterns
export interface ComponentUsageExamples {
  // Common usage patterns for each component type
  button: {
    primary: {
      description: 'Primary call-to-action buttons';
      props: {
        variant: 'primary';
        size: 'lg';
        text: 'Get Started';
      };
      context: ['hero sections', 'forms', 'pricing cards'];
      accessibility: {
        role: 'button';
        ariaLabel: 'Start your journey';
      };
    };
    secondary: {
      description: 'Secondary actions and navigation';
      props: {
        variant: 'secondary';
        size: 'md';
        text: 'Learn More';
      };
      context: ['feature lists', 'footer links'];
      accessibility: {
        role: 'button';
        ariaLabel: 'Learn more about our features';
      };
    };
  };
  form: {
    contact: {
      description: 'Contact form with validation';
      fields: [
        { type: 'text'; name: 'name'; label: 'Full Name'; required: true },
        { type: 'email'; name: 'email'; label: 'Email Address'; required: true },
        { type: 'textarea'; name: 'message'; label: 'Message'; required: true },
      ];
      validation: {
        realTime: true;
        errorMessages: {
          required: 'This field is required';
          email: 'Please enter a valid email address';
        };
      };
    };
    newsletter: {
      description: 'Email newsletter signup';
      fields: [{ type: 'email'; name: 'email'; label: 'Email Address'; required: true }];
      successMessage: 'Thanks for subscribing!';
      context: ['footer', 'blog sidebar'];
    };
  };
  card: {
    feature: {
      description: 'Feature showcase cards';
      structure: {
        image: 'feature-icon.svg';
        title: 'Feature Title';
        description: 'Feature description text';
        action: { text: 'Learn More'; href: '/features/feature-name' };
      };
      layout: 'vertical';
      spacing: 'comfortable';
    };
    testimonial: {
      description: 'Customer testimonial cards';
      structure: {
        quote: 'Customer testimonial text';
        author: 'Customer Name';
        role: 'Customer Role';
        company: 'Company Name';
        avatar: 'customer-avatar.jpg';
      };
      styling: 'bordered';
      layout: 'horizontal';
    };
  };
  navigation: {
    header: {
      description: 'Main site navigation';
      structure: {
        logo: { src: '/logo.svg'; alt: 'Company Logo' };
        menu: [
          { label: 'Home'; href: '/' },
          { label: 'Services'; href: '/services' },
          { label: 'About'; href: '/about' },
          { label: 'Contact'; href: '/contact' },
        ];
        cta: { text: 'Get Started'; href: '/signup' };
      };
      responsive: {
        mobile: 'hamburger menu';
        desktop: 'horizontal menu';
      };
    };
  };
}

// Page Template Examples
export interface PageTemplates {
  homepage: {
    name: 'Homepage';
    description: 'Main landing page with hero, features, and CTA';
    sections: [
      {
        name: 'hero';
        component: 'Hero';
        position: { row: 1; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'features';
        component: 'FeatureGrid';
        position: { row: 2; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'testimonials';
        component: 'TestimonialSlider';
        position: { row: 3; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'cta';
        component: 'CallToAction';
        position: { row: 4; column: 1; span: { row: 1; column: 12 } };
      },
    ];
  };
  about: {
    name: 'About Page';
    description: 'Company information and team showcase';
    sections: [
      {
        name: 'hero';
        component: 'Hero';
        variant: 'simple';
        position: { row: 1; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'story';
        component: 'ContentBlock';
        position: { row: 2; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'team';
        component: 'TeamGrid';
        position: { row: 3; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'values';
        component: 'ValueProposition';
        position: { row: 4; column: 1; span: { row: 1; column: 12 } };
      },
    ];
  };
  contact: {
    name: 'Contact Page';
    description: 'Contact form and company information';
    sections: [
      {
        name: 'hero';
        component: 'Hero';
        variant: 'simple';
        position: { row: 1; column: 1; span: { row: 1; column: 12 } };
      },
      {
        name: 'contact-form';
        component: 'ContactForm';
        position: { row: 2; column: 1; span: { row: 1; column: 6 } };
      },
      {
        name: 'contact-info';
        component: 'ContactInfo';
        position: { row: 2; column: 7; span: { row: 1; column: 6 } };
      },
    ];
  };
}

// Component Integration Patterns
export interface IntegrationPatterns {
  // How components work together
  dataFlow: {
    formSubmission: {
      pattern: 'Form → Validation → API → Success/Error State';
      components: ['Form', 'Button', 'Notification'];
      dataProps: ['formData', 'isSubmitting', 'errors', 'success'];
    };
    userAuthentication: {
      pattern: 'Login Form → Auth Service → Redirect/Dashboard';
      components: ['AuthForm', 'LoadingSpinner', 'ErrorMessage'];
      dataProps: ['user', 'isAuthenticated', 'loading', 'error'];
    };
  };
  stateManagement: {
    localState: ['form inputs', 'modal visibility', 'active tabs'];
    globalState: ['user session', 'theme preferences', 'shopping cart'];
    serverState: ['API data', 'user permissions', 'feature flags'];
  };
  eventHandling: {
    userInteractions: ['click', 'hover', 'focus', 'submit'];
    lifecycle: ['mount', 'update', 'unmount'];
    custom: ['custom analytics events', 'error boundaries'];
  };
}

export interface ComponentUsage {
  component: string;
  variant?: string;
  props: Record<string, any>;
  position: {
    row: number;
    column: number;
    span?: {
      row: number;
      column: number;
    };
  };
  responsive?: {
    hideOn?: string[];
    showOn?: string[];
    order?: Record<string, number>;
  };
}

// Interaction specification
export interface InteractionSpec {
  trigger: 'hover' | 'focus' | 'click' | 'scroll' | 'load' | 'custom';
  target: string;
  effect: 'show' | 'hide' | 'animate' | 'transform' | 'transition';
  duration?: number;
  easing?: string;
  properties?: Record<string, any>;
  conditions?: string[];
}

// Generation specification
export interface GenerationSpec {
  framework: 'nextjs' | 'vite' | 'astro' | 'custom';
  styling: 'tailwind' | 'styled-components' | 'css-modules' | 'custom';
  components: Record<string, ComponentSpec>;
  pages: PageSpec[];
  assets: {
    images: string[];
    fonts: string[];
    icons: string[];
  };
  build: {
    output: string;
    publicPath: string;
    optimization: {
      minify: boolean;
      compress: boolean;
      preload: boolean;
    };
  };
}

// Validation specification
export interface ValidationSpec {
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA';
    minScore: number;
    automated: boolean;
    manual?: string[];
  };
  performance: {
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
      pwa?: number;
    };
    metrics: {
      fcp: number;
      lcp: number;
      tti: number;
      tbt: number;
      cls: number;
      speedIndex: number;
    };
  };
  seo: {
    score: number;
    checks: string[];
  };
  responsive: {
    breakpoints: string[];
    devices: string[];
  };
}

// Messaging specification
export interface MessagingSpec {
  keyMessages: Array<{
    message: string;
    audience: string;
    context: string;
    proofPoints?: string[];
  }>;
  valuePropositions: Array<{
    headline: string;
    subheadline: string;
    benefits: string[];
  }>;
  callsToAction: Array<{
    primary: string;
    secondary: string;
    context: string;
  }>;
  tone?: {
    primary: string;
    secondary: string[];
    avoid: string[];
  };
}

// Main unified specification
export interface UnifiedSpec {
  version: string;
  source: SourceInfo;
  design: DesignSpec;
  brand: BrandSpec;
  architecture: InformationArchitecture;
  generation: GenerationSpec;
  validation: ValidationSpec;
  metadata: {
    created: string;
    updated: string;
    author?: string;
    license?: string;
    notes?: string[];
  };
}

// UI Pattern (re-exported for convenience)
export interface UIPattern {
  type: 'navigation' | 'hero' | 'cards' | 'form' | 'table' | 'pricing' | 'footer';
  variant: string;
  confidence: number;
  selector: string;
  properties: {
    layout?: 'grid' | 'flex' | 'block';
    columns?: number;
    spacing?: string;
    responsive?: boolean;
  };
  accessibility: {
    hasAriaLabel: boolean;
    hasRoles: boolean;
    keyboardNavigable: boolean;
    semanticHTML: boolean;
  };
  content: {
    headings: string[];
    text: string;
    links: string[];
    images: string[];
  };
}

// Export convenience types
export type SpecVersion = string;
export type ComponentType = ComponentSpec['type'];
export type PageLayout = PageSpec['layout']['type'];
export type InteractionTrigger = InteractionSpec['trigger'];
export type ValidationLevel = ValidationSpec['accessibility']['wcagLevel'];

// Collection types
export interface SpecCollection {
  specs: UnifiedSpec[];
  metadata: {
    created: string;
    updated: string;
    version: string;
    author?: string;
    description?: string;
  };
}

// Template types for code generation
export interface CodeTemplate {
  name: string;
  type: 'component' | 'page' | 'layout' | 'utility';
  framework: string;
  content: string;
  dependencies: string[];
  props?: Record<string, any>;
}

// Build configuration
export interface BuildConfig {
  framework: UnifiedSpec['generation']['framework'];
  styling: UnifiedSpec['generation']['styling'];
  output: string;
  publicPath: string;
  optimization: {
    minify: boolean;
    compress: boolean;
    preload: boolean;
    bundle: boolean;
  };
  assets: {
    images: {
      optimize: boolean;
      formats: string[];
      sizes: number[];
    };
    fonts: {
      preload: boolean;
      display: string;
    };
  };
  performance: {
    budget: {
      javascript: number;
      css: number;
      images: number;
    };
  };
}

// Deployment specification
export interface DeploymentSpec {
  platform: 'vercel' | 'netlify' | 'aws' | 'azure' | 'gcp' | 'custom';
  config: Record<string, any>;
  domains: string[];
  redirects: Array<{
    from: string;
    to: string;
    status: number;
  }>;
  headers: Array<{
    pattern: string;
    headers: Record<string, string>;
  }>;
  environment: Record<string, string>;
}

// Integration types
export interface IntegrationSpec {
  analytics: {
    provider: 'google' | 'plausible' | 'custom';
    config: Record<string, any>;
  };
  cms?: {
    provider: 'contentful' | 'strapi' | 'sanity' | 'custom';
    config: Record<string, any>;
  };
  forms?: {
    provider: 'netlify' | 'formspree' | 'custom';
    config: Record<string, any>;
  };
  eCommerce?: {
    provider: 'shopify' | 'stripe' | 'custom';
    config: Record<string, any>;
  };
}

// Export all interfaces
export {
  DesignTokens,
  QualityScore,
  AccessibilityReport,
  PerformanceReport,
  BrandProfile,
  ContentInventory,
  InformationArchitecture,
  SEOMetadata,
};
