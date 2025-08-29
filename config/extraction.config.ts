export interface ViewportConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export interface QualityConfig {
  minScore: number;
  requireAccessibility: boolean;
  maxExtractionTime: number;
  screenshotQuality: number;
  enableAnimations: boolean;
  waitForNetworkIdle: boolean;
}

export interface CrawlingConfig {
  maxPages: number;
  maxDepth: number;
  rateLimit: number;
  timeout: number;
  respectRobotsTxt: boolean;
  userAgent: string;
  followExternalLinks: boolean;
  includeImages: boolean;
  includeStylesheets: boolean;
}

export interface PatternConfig {
  minConfidence: number;
  detectVariants: boolean;
  maxPatternsPerType: number;
  enableSemanticDetection: boolean;
  detectAccessibilityFeatures: boolean;
}

export interface ExtractionConfig {
  viewports: ViewportConfig;
  quality: QualityConfig;
  crawling: CrawlingConfig;
  patterns: PatternConfig;
  output: {
    format: 'json' | 'yaml';
    includeScreenshots: boolean;
    compressAssets: boolean;
    generateReport: boolean;
  };
}

const extractionConfig: ExtractionConfig = {
  // Viewport configurations for responsive testing
  viewports: {
    mobile: 375, // iPhone SE
    tablet: 768, // iPad
    desktop: 1440, // Standard desktop
    wide: 1920, // Wide screens
  },

  // Quality control settings
  quality: {
    minScore: 0.7, // Minimum quality score to pass
    requireAccessibility: true, // Always check accessibility
    maxExtractionTime: 60000, // 60 seconds max per page
    screenshotQuality: 80, // JPEG quality for screenshots
    enableAnimations: true, // Wait for animations to complete
    waitForNetworkIdle: true, // Wait for network to be idle
  },

  // Crawling behavior
  crawling: {
    maxPages: 50, // Maximum pages to crawl
    maxDepth: 3, // Maximum crawl depth
    rateLimit: 500, // Delay between requests (ms)
    timeout: 30000, // Page load timeout
    respectRobotsTxt: true, // Respect robots.txt
    userAgent: 'WebStyleTransfer/1.0 (https://github.com/web-style-transfer)',
    followExternalLinks: false, // Stay within same domain
    includeImages: true, // Extract image information
    includeStylesheets: true, // Extract stylesheet information
  },

  // Pattern detection settings
  patterns: {
    minConfidence: 0.7, // Minimum confidence to include pattern
    detectVariants: true, // Detect pattern variants
    maxPatternsPerType: 10, // Maximum patterns per type
    enableSemanticDetection: true, // Use semantic HTML detection
    detectAccessibilityFeatures: true, // Check for accessibility features
  },

  // Output configuration
  output: {
    format: 'json', // Output format
    includeScreenshots: false, // Include screenshots in output
    compressAssets: true, // Compress extracted assets
    generateReport: true, // Generate HTML report
  },
};

export default extractionConfig;

// Helper functions for config validation
export function validateConfig(config: ExtractionConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate viewports
  if (config.viewports.mobile <= 0) {
    errors.push('Mobile viewport width must be positive');
  }
  if (config.viewports.tablet <= config.viewports.mobile) {
    errors.push('Tablet viewport width must be larger than mobile');
  }
  if (config.viewports.desktop <= config.viewports.tablet) {
    errors.push('Desktop viewport width must be larger than tablet');
  }

  // Validate quality settings
  if (config.quality.minScore < 0 || config.quality.minScore > 1) {
    errors.push('Quality score must be between 0 and 1');
  }
  if (config.quality.maxExtractionTime <= 0) {
    errors.push('Maximum extraction time must be positive');
  }

  // Validate crawling settings
  if (config.crawling.maxPages <= 0) {
    errors.push('Maximum pages must be positive');
  }
  if (config.crawling.maxDepth <= 0) {
    errors.push('Maximum depth must be positive');
  }
  if (config.crawling.rateLimit < 0) {
    errors.push('Rate limit must be non-negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Environment-specific configurations
export function getProductionConfig(): ExtractionConfig {
  return {
    ...extractionConfig,
    quality: {
      ...extractionConfig.quality,
      minScore: 0.8,
      screenshotQuality: 90,
    },
    crawling: {
      ...extractionConfig.crawling,
      maxPages: 100,
      rateLimit: 1000,
    },
  };
}

export function getDevelopmentConfig(): ExtractionConfig {
  return {
    ...extractionConfig,
    quality: {
      ...extractionConfig.quality,
      minScore: 0.5,
      screenshotQuality: 60,
    },
    crawling: {
      ...extractionConfig.crawling,
      maxPages: 10,
      rateLimit: 100,
    },
  };
}

// Config presets for different use cases
export const CONFIG_PRESETS = {
  fast: {
    ...extractionConfig,
    crawling: { ...extractionConfig.crawling, maxPages: 5, rateLimit: 100 },
    patterns: { ...extractionConfig.patterns, minConfidence: 0.8 },
  },

  comprehensive: {
    ...extractionConfig,
    crawling: { ...extractionConfig.crawling, maxPages: 100, maxDepth: 5 },
    patterns: { ...extractionConfig.patterns, minConfidence: 0.6 },
  },

  accessible: {
    ...extractionConfig,
    quality: { ...extractionConfig.quality, requireAccessibility: true },
    patterns: { ...extractionConfig.patterns, detectAccessibilityFeatures: true },
  },
};
