// S-tier Design Principles
// extractors/schemas/s-tier-principles.ts

// Core Design System Interfaces
export interface DesignToken {
  $value: string | number;
  $type: string;
  $description?: string;
}

export interface DesignScale {
  [key: string]: DesignToken;
}

// 1. GRID SYSTEM
export interface GridSystem {
  baseUnit: number; // 8px
  scaleMultipliers: number[]; // [1, 2, 3, 4, 5, 6, 7, 8]
  containerMaxWidth: number; // 1200px
  gutterSpacing: Record<string, number>; // 16px-32px
}

export interface BreakpointSystem {
  mobile: { min: number; max: number; container: number; columns: number; gutter: number };
  tablet: { min: number; max: number; container: number; columns: number; gutter: number };
  desktop: { min: number; max: number; container: number; columns: number; gutter: number };
  wide: { min: number; container: number; columns: number; gutter: number };
}

// 2. COLOR CONTRAST REQUIREMENTS
export interface ColorContrastRequirements {
  normalText: {
    aa: number; // 4.5:1
    aaa: number; // 7:1
  };
  largeText: {
    aa: number; // 3:1 (18pt+ or 14pt+ bold)
    aaa: number; // 4.5:1
  };
  uiComponents: {
    minimum: number; // 3:1
    preferred: number; // 4.5:1
  };
  focusIndicators: {
    minimum: number; // 3:1
    preferred: number; // 4.5:1
  };
  nonTextContent: {
    minimum: number; // 3:1
    preferred: number; // 4.5:1
  };
}

export interface ColorAccessibility {
  requirements: ColorContrastRequirements;
  colorBlindness: {
    avoidRedGreen: boolean;
    addVisualCues: boolean;
    testSimulators: boolean;
    maintainContrast: boolean;
  };
}

// 3. TYPOGRAPHY SCALE
export interface TypographyScale {
  modular: {
    ratio: number; // 1.2
    values: Record<string, number>; // 16px → 19.2px → 23px → 27.6px → 33.1px
  };
  heading: {
    ratio: number; // 1.25
    values: Record<string, number>; // 32px → 40px → 50px → 62.5px → 78px
  };
  smallText: {
    values: Record<string, number>; // 14px → 12px → 11px
  };
  lineHeight: {
    min: number; // 1.4
    max: number; // 1.6
    optimal: number; // 1.5
  };
}

export interface FontSystem {
  primary: string;
  secondary?: string;
  monospace: string;
  fallback: string[];
}

// 4. ANIMATION & MOTION
export interface AnimationSystem {
  microInteractions: {
    duration: number; // 150ms
    easing: string; // ease-out
    usage: string[];
  };
  pageTransitions: {
    duration: number; // 300ms
    easing: string; // ease-in-out
    usage: string[];
  };
  loadingStates: {
    duration: number; // 500ms
    easing: string; // linear
    usage: string[];
  };
  entranceAnimations: {
    duration: number[]; // 200-400ms
    easing: string; // ease-out
    usage: string[];
  };
}

// 5. PERFORMANCE BUDGET
export interface PerformanceBudget {
  firstContentfulPaint: {
    target: number; // 1500ms
    warning: number; // 2500ms
    failure: number; // 3000ms
  };
  largestContentfulPaint: {
    target: number; // 2500ms
    warning: number; // 4000ms
    failure: number; // 5000ms
  };
  cumulativeLayoutShift: {
    target: number; // 0.1
    warning: number; // 0.25
    failure: number; // 0.25
  };
  totalBlockingTime: {
    target: number; // 200ms
    warning: number; // 600ms
    failure: number; // 1000ms
  };
  bundleSize: {
    target: number; // 500KB
    warning: number; // 800KB
    failure: number; // 1MB
  };
  speedIndex: {
    target: number; // 1500ms
    warning: number; // 2500ms
    failure: number; // 3000ms
  };
}

// 6. RESPONSIVE DESIGN
export interface ResponsiveSystem {
  breakpoints: BreakpointSystem;
  fluidTypography: {
    min: string; // 14px
    max: string; // 18px
    viewport: string; // 2.5vw
  };
  containerQueries: {
    small: string; // 640px
    medium: string; // 768px
    large: string; // 1024px
  };
}

// 7. COMPONENT DESIGN STANDARDS
export interface ComponentStandards {
  button: {
    variants: {
      primary: {
        background: string;
        color: string;
        hover: { background: string; transform: string };
        focus: { outline: string; offset: string };
      };
      secondary: {
        background: string;
        border: string;
        color: string;
      };
    };
    spacing: {
      padding: Record<string, string>;
      borderRadius: Record<string, string>;
    };
  };
  form: {
    input: {
      height: Record<string, string>;
      padding: Record<string, string>;
      border: string;
      focus: { border: string; shadow: string };
    };
    label: {
      margin: string;
      fontSize: string;
    };
    validation: {
      success: { color: string; icon: string };
      error: { color: string; icon: string; message: string };
    };
  };
  card: {
    padding: Record<string, string>;
    borderRadius: Record<string, string>;
    shadow: Record<string, string>;
    hover: {
      transform: string;
      shadow: Record<string, string>;
    };
  };
}

// 8. ACCESSIBILITY STANDARDS
export interface AccessibilityStandards {
  wcagLevel: 'A' | 'AA' | 'AAA';
  checklist: {
    perceivable: {
      textAlternatives: boolean;
      timeBasedMedia: boolean;
      adaptable: boolean;
      distinguishable: boolean;
    };
    operable: {
      keyboardAccessible: boolean;
      enoughTime: boolean;
      seizures: boolean;
      navigable: boolean;
    };
    understandable: {
      readable: boolean;
      predictable: boolean;
      inputAssistance: boolean;
    };
    robust: {
      compatible: boolean;
      parsing: boolean;
      nameRoleValue: boolean;
    };
  };
  colorContrast: ColorContrastRequirements;
  keyboardNavigation: {
    tabOrder: boolean;
    focusIndicators: boolean;
    skipLinks: boolean;
    shortcuts: Record<string, string>;
  };
  screenReader: {
    semanticHTML: boolean;
    ariaLabels: boolean;
    liveRegions: boolean;
    announcements: boolean;
  };
}

// 9. QUALITY ASSURANCE METRICS
export interface QualityMetrics {
  designConsistency: {
    weight: number; // 20%
    target: number; // 0.85
    description: string;
  };
  typographyHierarchy: {
    weight: number; // 25%
    target: number; // 0.90
    description: string;
  };
  spacingRegularity: {
    weight: number; // 20%
    target: number; // 0.80
    description: string;
  };
  accessibilityCompliance: {
    weight: number; // 15%
    target: number; // 0.95
    description: string;
  };
  patternConsistency: {
    weight: number; // 10%
    target: number; // 0.75
    description: string;
  };
  performanceOptimization: {
    weight: number; // 5%
    target: number; // 0.90
    description: string;
  };
  modernityScore: {
    weight: number; // 5%
    target: number; // 0.70
    description: string;
  };
}

export interface AutomatedChecks {
  colorContrast: {
    minimum: number;
    automated: boolean;
  };
  performanceBudget: {
    fcp: number;
    lcp: number;
    cls: number;
    automated: boolean;
  };
  accessibilityScore: {
    minimum: number;
    automated: boolean;
  };
}

// MAIN S-TIER PRINCIPLES INTERFACE
export interface STierPrinciples {
  version: string;
  grid: GridSystem;
  breakpoints: BreakpointSystem;
  color: ColorAccessibility;
  typography: {
    scale: TypographyScale;
    fonts: FontSystem;
  };
  motion: AnimationSystem;
  performance: PerformanceBudget;
  responsive: ResponsiveSystem;
  components: ComponentStandards;
  accessibility: AccessibilityStandards;
  quality: {
    metrics: QualityMetrics;
    automatedChecks: AutomatedChecks;
  };
  guidelines: {
    dos: string[];
    donts: string[];
  };
  checklists: {
    preDevelopment: string[];
    development: string[];
    qualityAssurance: string[];
    deployment: string[];
  };
}

// UTILITY FUNCTIONS
export class STierValidator {
  static validateColorContrast(_fg: string, _bg: string, _level: 'AA' | 'AAA' = 'AA'): boolean {
    // Implementation would calculate actual contrast ratio
    return true; // Placeholder
  }

  static validateTypographyScale(_scale: TypographyScale): boolean {
    // Validate scale ratios and values
    return true; // Placeholder
  }

  static validatePerformanceBudget(_metrics: PerformanceBudget): boolean {
    // Validate against defined budgets
    return true; // Placeholder
  }
}

// CONSTANTS
export const S_TIER_CONSTANTS = {
  GRID_BASE_UNIT: 8,
  SCALE_MULTIPLIERS: [1, 2, 3, 4, 5, 6, 7, 8],
  CONTAINER_MAX_WIDTH: 1200,
  COLOR_CONTRAST_AA: 4.5,
  COLOR_CONTRAST_AAA: 7.0,
  TYPOGRAPHY_MODULAR_RATIO: 1.2,
  TYPOGRAPHY_HEADING_RATIO: 1.25,
  ANIMATION_MICRO_DURATION: 150,
  ANIMATION_PAGE_DURATION: 300,
  ANIMATION_LOADING_DURATION: 500,
  PERFORMANCE_FCP_TARGET: 1500,
  PERFORMANCE_LCP_TARGET: 2500,
  PERFORMANCE_CLS_TARGET: 0.1,
  BREAKPOINTS: {
    MOBILE: { min: 320, max: 767, container: 100 },
    TABLET: { min: 768, max: 1023, container: 720 },
    DESKTOP: { min: 1024, max: 1439, container: 960 },
    WIDE: { min: 1440, container: 1200 },
  },
} as const;

// EXPORT DEFAULT PRINCIPLES INSTANCE
export const defaultSTierPrinciples: STierPrinciples = {
  version: '1.0.0',
  grid: {
    baseUnit: S_TIER_CONSTANTS.GRID_BASE_UNIT,
    scaleMultipliers: [...S_TIER_CONSTANTS.SCALE_MULTIPLIERS],
    containerMaxWidth: S_TIER_CONSTANTS.CONTAINER_MAX_WIDTH,
    gutterSpacing: {
      mobile: 16,
      tablet: 24,
      desktop: 32,
      wide: 32,
    },
  },
  breakpoints: {
    mobile: {
      min: S_TIER_CONSTANTS.BREAKPOINTS.MOBILE.min,
      max: S_TIER_CONSTANTS.BREAKPOINTS.MOBILE.max,
      container: S_TIER_CONSTANTS.BREAKPOINTS.MOBILE.container,
      columns: 1,
      gutter: 16,
    },
    tablet: {
      min: S_TIER_CONSTANTS.BREAKPOINTS.TABLET.min,
      max: S_TIER_CONSTANTS.BREAKPOINTS.TABLET.max,
      container: S_TIER_CONSTANTS.BREAKPOINTS.TABLET.container,
      columns: 3,
      gutter: 24,
    },
    desktop: {
      min: S_TIER_CONSTANTS.BREAKPOINTS.DESKTOP.min,
      max: S_TIER_CONSTANTS.BREAKPOINTS.DESKTOP.max,
      container: S_TIER_CONSTANTS.BREAKPOINTS.DESKTOP.container,
      columns: 4,
      gutter: 32,
    },
    wide: {
      min: S_TIER_CONSTANTS.BREAKPOINTS.WIDE.min,
      container: S_TIER_CONSTANTS.BREAKPOINTS.WIDE.container,
      columns: 6,
      gutter: 32,
    },
  },
  color: {
    requirements: {
      normalText: {
        aa: S_TIER_CONSTANTS.COLOR_CONTRAST_AA,
        aaa: S_TIER_CONSTANTS.COLOR_CONTRAST_AAA,
      },
      largeText: { aa: 3.0, aaa: 4.5 },
      uiComponents: { minimum: 3.0, preferred: S_TIER_CONSTANTS.COLOR_CONTRAST_AA },
      focusIndicators: { minimum: 3.0, preferred: S_TIER_CONSTANTS.COLOR_CONTRAST_AA },
      nonTextContent: { minimum: 3.0, preferred: S_TIER_CONSTANTS.COLOR_CONTRAST_AA },
    },
    colorBlindness: {
      avoidRedGreen: true,
      addVisualCues: true,
      testSimulators: true,
      maintainContrast: true,
    },
  },
  typography: {
    scale: {
      modular: {
        ratio: S_TIER_CONSTANTS.TYPOGRAPHY_MODULAR_RATIO,
        values: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 19.2,
          xl: 23,
          '2xl': 27.6,
          '3xl': 33.1,
        },
      },
      heading: {
        ratio: S_TIER_CONSTANTS.TYPOGRAPHY_HEADING_RATIO,
        values: {
          h1: 32,
          h2: 40,
          h3: 50,
          h4: 62.5,
          h5: 78,
        },
      },
      smallText: {
        values: {
          caption: 12,
          label: 11,
        },
      },
      lineHeight: {
        min: 1.4,
        max: 1.6,
        optimal: 1.5,
      },
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Georgia, serif',
      monospace: 'JetBrains Mono, monospace',
      fallback: ['system-ui', '-apple-system', 'sans-serif'],
    },
  },
  motion: {
    microInteractions: {
      duration: S_TIER_CONSTANTS.ANIMATION_MICRO_DURATION,
      easing: 'ease-out',
      usage: ['Button hovers', 'Toggle switches', 'Icon animations'],
    },
    pageTransitions: {
      duration: S_TIER_CONSTANTS.ANIMATION_PAGE_DURATION,
      easing: 'ease-in-out',
      usage: ['Route changes', 'Modal open/close', 'Tab switching'],
    },
    loadingStates: {
      duration: S_TIER_CONSTANTS.ANIMATION_LOADING_DURATION,
      easing: 'linear',
      usage: ['Progress bars', 'Spinners', 'Skeleton screens'],
    },
    entranceAnimations: {
      duration: [200, 400],
      easing: 'ease-out',
      usage: ['Element reveals', 'Notifications', 'Tooltips'],
    },
  },
  performance: {
    firstContentfulPaint: {
      target: S_TIER_CONSTANTS.PERFORMANCE_FCP_TARGET,
      warning: 2500,
      failure: 3000,
    },
    largestContentfulPaint: {
      target: S_TIER_CONSTANTS.PERFORMANCE_LCP_TARGET,
      warning: 4000,
      failure: 5000,
    },
    cumulativeLayoutShift: {
      target: S_TIER_CONSTANTS.PERFORMANCE_CLS_TARGET,
      warning: 0.25,
      failure: 0.25,
    },
    totalBlockingTime: {
      target: 200,
      warning: 600,
      failure: 1000,
    },
    bundleSize: {
      target: 512000, // 500KB
      warning: 819200, // 800KB
      failure: 1048576, // 1MB
    },
    speedIndex: {
      target: 1500,
      warning: 2500,
      failure: 3000,
    },
  },
  responsive: {
    breakpoints: {} as BreakpointSystem, // Reference to above
    fluidTypography: {
      min: '14px',
      max: '18px',
      viewport: '2.5vw',
    },
    containerQueries: {
      small: '640px',
      medium: '768px',
      large: '1024px',
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          background: 'brand.primary',
          color: 'neutral.50',
          hover: { background: 'brand.primary.hover', transform: 'translateY(-1px)' },
          focus: { outline: '2px solid brand.primary', offset: '2px' },
        },
        secondary: {
          background: 'transparent',
          border: '1px solid neutral.300',
          color: 'neutral.900',
        },
      },
      spacing: {
        padding: { sm: '0.5rem 1rem', md: '0.75rem 1.5rem', lg: '1rem 2rem' },
        borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem' },
      },
    },
    form: {
      input: {
        height: { sm: '2.5rem', md: '3rem', lg: '3.5rem' },
        padding: { sm: '0.5rem 0.75rem', md: '0.75rem 1rem', lg: '1rem 1.25rem' },
        border: '1px solid neutral.300',
        focus: { border: '1px solid brand.primary', shadow: '0 0 0 3px rgba(brand.primary, 0.1)' },
      },
      label: {
        margin: '0 0 0.5rem 0',
        fontSize: '0.875rem',
      },
      validation: {
        success: { color: 'semantic.success', icon: 'check-circle' },
        error: { color: 'semantic.error', icon: 'alert-circle', message: 'This field is required' },
      },
    },
    card: {
      padding: { sm: '1rem', md: '1.5rem', lg: '2rem' },
      borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem' },
      shadow: { sm: '0 1px 3px rgba(0,0,0,0.1)', md: '0 4px 6px rgba(0,0,0,0.1)' },
      hover: {
        transform: 'translateY(-2px)',
        shadow: { md: '0 10px 15px rgba(0,0,0,0.1)', lg: '0 20px 25px rgba(0,0,0,0.1)' },
      },
    },
  },
  accessibility: {
    wcagLevel: 'AA',
    checklist: {
      perceivable: {
        textAlternatives: true,
        timeBasedMedia: true,
        adaptable: true,
        distinguishable: true,
      },
      operable: {
        keyboardAccessible: true,
        enoughTime: true,
        seizures: true,
        navigable: true,
      },
      understandable: {
        readable: true,
        predictable: true,
        inputAssistance: true,
      },
      robust: {
        compatible: true,
        parsing: true,
        nameRoleValue: true,
      },
    },
    colorContrast: {} as ColorContrastRequirements, // Reference to color.requirements
    keyboardNavigation: {
      tabOrder: true,
      focusIndicators: true,
      skipLinks: true,
      shortcuts: {
        'Alt+H': 'Skip to main content',
        'Alt+N': 'Skip to navigation',
      },
    },
    screenReader: {
      semanticHTML: true,
      ariaLabels: true,
      liveRegions: true,
      announcements: true,
    },
  },
  quality: {
    metrics: {
      designConsistency: {
        weight: 0.2,
        target: 0.85,
        description: 'Harmonious color relationships and spacing patterns',
      },
      typographyHierarchy: {
        weight: 0.25,
        target: 0.9,
        description: 'Clear text hierarchy and readability',
      },
      spacingRegularity: {
        weight: 0.2,
        target: 0.8,
        description: 'Consistent spacing patterns throughout',
      },
      accessibilityCompliance: {
        weight: 0.15,
        target: 0.95,
        description: 'WCAG 2.1 AA compliance',
      },
      patternConsistency: {
        weight: 0.1,
        target: 0.75,
        description: 'Reusable design patterns',
      },
      performanceOptimization: {
        weight: 0.05,
        target: 0.9,
        description: 'Fast loading and interaction',
      },
      modernityScore: {
        weight: 0.05,
        target: 0.7,
        description: 'Current design trends and technologies',
      },
    },
    automatedChecks: {
      colorContrast: {
        minimum: S_TIER_CONSTANTS.COLOR_CONTRAST_AA,
        automated: true,
      },
      performanceBudget: {
        fcp: S_TIER_CONSTANTS.PERFORMANCE_FCP_TARGET,
        lcp: S_TIER_CONSTANTS.PERFORMANCE_LCP_TARGET,
        cls: S_TIER_CONSTANTS.PERFORMANCE_CLS_TARGET,
        automated: true,
      },
      accessibilityScore: {
        minimum: 95,
        automated: true,
      },
    },
  },
  guidelines: {
    dos: [
      'Use semantic HTML elements',
      'Implement proper heading hierarchy (H1→H2→H3...)',
      'Provide alternative text for images',
      'Ensure keyboard accessibility',
      'Test across multiple devices and browsers',
      'Use consistent spacing from the 8px grid',
      'Maintain color contrast ratios above 4.5:1',
      'Optimize images and assets for web',
      'Use modern CSS features with fallbacks',
      'Document design decisions and rationale',
    ],
    donts: [
      "Don't use color alone to convey meaning",
      "Don't create fixed widths that don't adapt to content",
      "Don't ignore focus states for interactive elements",
      "Don't use images of text",
      "Don't rely on JavaScript for critical functionality",
      "Don't create layouts that require horizontal scrolling",
      "Don't use font sizes below 14px for body text",
      "Don't ignore loading states and error handling",
      "Don't break established design patterns without reason",
      "Don't optimize for aesthetics at the expense of usability",
    ],
  },
  checklists: {
    preDevelopment: [
      'Design tokens created and validated',
      'Color contrast ratios verified',
      'Typography scale established',
      'Component specifications documented',
      'Accessibility requirements reviewed',
    ],
    development: [
      'Semantic HTML structure implemented',
      'Responsive breakpoints applied',
      'Keyboard navigation tested',
      'Screen reader compatibility verified',
      'Performance budget monitored',
    ],
    qualityAssurance: [
      'Cross-browser testing completed',
      'Accessibility audit passed',
      'Performance metrics within budget',
      'Design consistency validated',
      'Code review completed',
    ],
    deployment: [
      'Assets optimized and compressed',
      'CDN configuration verified',
      'Monitoring and analytics implemented',
      'Documentation updated',
      'Stakeholder approval obtained',
    ],
  },
};

// Initialize circular references
defaultSTierPrinciples.responsive.breakpoints = defaultSTierPrinciples.breakpoints;
defaultSTierPrinciples.accessibility.colorContrast = defaultSTierPrinciples.color.requirements;
