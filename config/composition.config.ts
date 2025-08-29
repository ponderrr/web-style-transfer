export interface TokenNormalizationConfig {
  colors: {
    format: 'hex' | 'hsl' | 'rgb';
    normalizeCase: boolean;
    removeAlpha: boolean;
    consolidateSimilar: boolean;
    similarityThreshold: number;
  };
  typography: {
    normalizeFontSizes: boolean;
    standardizeLineHeights: boolean;
    consolidateFontFamilies: boolean;
    maxFontFamilies: number;
  };
  spacing: {
    baseUnit: number;
    normalizeUnits: boolean;
    consolidateValues: boolean;
    maxSpacingValues: number;
  };
  shadows: {
    normalizeBoxShadow: boolean;
    consolidateSimilar: boolean;
    maxShadowValues: number;
  };
}

export interface PatternMappingConfig {
  componentTypes: {
    button: string[];
    input: string[];
    card: string[];
    navigation: string[];
    modal: string[];
    form: string[];
  };
  layoutPatterns: {
    grid: string[];
    flexbox: string[];
    spacing: string[];
    alignment: string[];
  };
  interactionPatterns: {
    hover: string[];
    focus: string[];
    active: string[];
    disabled: string[];
  };
  semanticMappings: {
    primary: string[];
    secondary: string[];
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
  };
}

export interface CompositionConfig {
  tokenNormalization: TokenNormalizationConfig;
  patternMappings: PatternMappingConfig;
  output: {
    format: 'json' | 'yaml' | 'typescript';
    includeMetadata: boolean;
    generateTypes: boolean;
    validateComposition: boolean;
  };
  validation: {
    requireColorContrast: boolean;
    validateAccessibility: boolean;
    checkPerformance: boolean;
    enforceConsistency: boolean;
  };
}

const compositionConfig: CompositionConfig = {
  // Token normalization rules
  tokenNormalization: {
    colors: {
      format: 'hex', // Standardize color format
      normalizeCase: true, // Convert to lowercase
      removeAlpha: false, // Keep alpha channels
      consolidateSimilar: true, // Merge similar colors
      similarityThreshold: 5, // Color difference threshold
    },
    typography: {
      normalizeFontSizes: true, // Standardize font sizes
      standardizeLineHeights: true, // Normalize line heights
      consolidateFontFamilies: true, // Merge similar font families
      maxFontFamilies: 3, // Maximum font families to keep
    },
    spacing: {
      baseUnit: 4, // Base spacing unit (px)
      normalizeUnits: true, // Convert all to consistent units
      consolidateValues: true, // Merge similar spacing values
      maxSpacingValues: 12, // Maximum spacing values to keep
    },
    shadows: {
      normalizeBoxShadow: true, // Standardize shadow syntax
      consolidateSimilar: true, // Merge similar shadows
      maxShadowValues: 8, // Maximum shadow values to keep
    },
  },

  // Pattern mapping configurations
  patternMappings: {
    componentTypes: {
      button: ['button', 'btn', '.button', '[role="button"]', '.cta'],
      input: ['input', 'textarea', 'select', '.input', '.field'],
      card: ['.card', '.panel', '.component', '[data-component="card"]'],
      navigation: ['nav', '.nav', '.navigation', '.menu', '.navbar'],
      modal: ['.modal', '.dialog', '.popup', '[role="dialog"]'],
      form: ['form', '.form', '.contact-form'],
    },
    layoutPatterns: {
      grid: ['.grid', '.row', '.col', '.container'],
      flexbox: ['.flex', '.flexbox', '.d-flex'],
      spacing: ['.spacing', '.gap', '.margin', '.padding'],
      alignment: ['.text-center', '.text-left', '.text-right', '.justify-content'],
    },
    interactionPatterns: {
      hover: [':hover', '.hover', '[data-hover]'],
      focus: [':focus', '.focus', '[data-focus]'],
      active: [':active', '.active', '[data-active]'],
      disabled: [':disabled', '.disabled', '[data-disabled]', '[aria-disabled="true"]'],
    },
    semanticMappings: {
      primary: ['primary', 'brand', 'main', 'accent'],
      secondary: ['secondary', 'muted', 'gray', 'neutral'],
      success: ['success', 'green', 'positive', 'ok'],
      warning: ['warning', 'yellow', 'caution', 'alert'],
      error: ['error', 'red', 'danger', 'negative'],
      info: ['info', 'blue', 'information', 'notice'],
    },
  },

  // Output configuration
  output: {
    format: 'typescript', // Output format
    includeMetadata: true, // Include extraction metadata
    generateTypes: true, // Generate TypeScript types
    validateComposition: true, // Validate composed design system
  },

  // Validation rules
  validation: {
    requireColorContrast: true, // Enforce WCAG contrast ratios
    validateAccessibility: true, // Check accessibility compliance
    checkPerformance: true, // Validate performance impact
    enforceConsistency: true, // Ensure design consistency
  },
};

export default compositionConfig;

// Helper functions for composition validation
export function validateCompositionConfig(config: CompositionConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate token normalization
  if (config.tokenNormalization.spacing.baseUnit <= 0) {
    errors.push('Base spacing unit must be positive');
  }
  if (
    config.tokenNormalization.colors.similarityThreshold < 0 ||
    config.tokenNormalization.colors.similarityThreshold > 100
  ) {
    errors.push('Color similarity threshold must be between 0 and 100');
  }

  // Validate pattern mappings
  if (Object.keys(config.patternMappings.componentTypes).length === 0) {
    errors.push('Component types cannot be empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Environment-specific configurations
export function getProductionCompositionConfig(): CompositionConfig {
  return {
    ...compositionConfig,
    tokenNormalization: {
      ...compositionConfig.tokenNormalization,
      colors: {
        ...compositionConfig.tokenNormalization.colors,
        similarityThreshold: 3, // Stricter color consolidation
      },
      typography: {
        ...compositionConfig.tokenNormalization.typography,
        maxFontFamilies: 2, // Limit font families more strictly
      },
    },
    validation: {
      ...compositionConfig.validation,
      requireColorContrast: true,
      validateAccessibility: true,
      checkPerformance: true,
    },
  };
}

export function getDevelopmentCompositionConfig(): CompositionConfig {
  return {
    ...compositionConfig,
    tokenNormalization: {
      ...compositionConfig.tokenNormalization,
      colors: {
        ...compositionConfig.tokenNormalization.colors,
        consolidateSimilar: false, // Keep original colors for debugging
      },
    },
    validation: {
      ...compositionConfig.validation,
      requireColorContrast: false, // Skip during development
      checkPerformance: false,
    },
  };
}

// Config presets for different composition strategies
export const COMPOSITION_PRESETS = {
  minimal: {
    ...compositionConfig,
    tokenNormalization: {
      ...compositionConfig.tokenNormalization,
      colors: { ...compositionConfig.tokenNormalization.colors, consolidateSimilar: false },
      typography: {
        ...compositionConfig.tokenNormalization.typography,
        consolidateFontFamilies: false,
      },
      spacing: { ...compositionConfig.tokenNormalization.spacing, consolidateValues: false },
    },
  },

  comprehensive: {
    ...compositionConfig,
    tokenNormalization: {
      ...compositionConfig.tokenNormalization,
      colors: { ...compositionConfig.tokenNormalization.colors, similarityThreshold: 2 },
      typography: { ...compositionConfig.tokenNormalization.typography, maxFontFamilies: 5 },
      spacing: { ...compositionConfig.tokenNormalization.spacing, maxSpacingValues: 20 },
    },
  },

  accessible: {
    ...compositionConfig,
    patternMappings: {
      ...compositionConfig.patternMappings,
      interactionPatterns: {
        ...compositionConfig.patternMappings.interactionPatterns,
        focus: [
          ...compositionConfig.patternMappings.interactionPatterns.focus,
          '[data-focus-visible]',
        ],
      },
    },
    validation: {
      ...compositionConfig.validation,
      requireColorContrast: true,
      validateAccessibility: true,
    },
  },
};
