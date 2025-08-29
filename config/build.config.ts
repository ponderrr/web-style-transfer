export interface FrameworkConfig {
  primary: "react" | "vue" | "svelte" | "angular" | "vanilla";
  version: string;
  typescript: boolean;
  styling: "css" | "scss" | "styled-components" | "emotion" | "tailwind";
  stateManagement?: "redux" | "zustand" | "pinia" | "context" | "none";
}

export interface OutputPathsConfig {
  components: string;
  styles: string;
  assets: string;
  types: string;
  docs: string;
  root: string;
}

export interface ComponentPreferencesConfig {
  namingConvention: "pascal" | "camel" | "kebab";
  fileExtension: "tsx" | "jsx" | "vue" | "svelte" | "ts" | "js";
  generateIndexFiles: boolean;
  includeStories: boolean;
  includeTests: boolean;
  exportFormat: "named" | "default" | "both";
}

export interface BuildOptimizationConfig {
  codeSplitting: boolean;
  treeShaking: boolean;
  minification: boolean;
  compression: boolean;
  imageOptimization: boolean;
  fontOptimization: boolean;
}

export interface BuildConfig {
  framework: FrameworkConfig;
  paths: OutputPathsConfig;
  components: ComponentPreferencesConfig;
  optimization: BuildOptimizationConfig;
  tooling: {
    bundler: "webpack" | "vite" | "rollup" | "esbuild";
    testing: "jest" | "vitest" | "cypress" | "playwright";
    linting: "eslint" | "prettier" | "stylelint";
    documentation: "storybook" | "docusaurus" | "none";
  };
  deployment: {
    target: "static" | "spa" | "ssr" | "isr";
    cdn: boolean;
    domain?: string;
    basePath: string;
  };
}

const buildConfig: BuildConfig = {
  // Framework and technology choices
  framework: {
    primary: "react", // Primary framework
    version: "18.2.0", // Framework version
    typescript: true, // Use TypeScript
    styling: "tailwind", // Styling approach
    stateManagement: "zustand", // State management solution
  },

  // Output paths (using forward slashes for cross-platform compatibility)
  paths: {
    components: "src/components", // Component output directory
    styles: "src/styles", // Styles output directory
    assets: "public/assets", // Static assets directory
    types: "src/types", // TypeScript types directory
    docs: "docs/components", // Documentation directory
    root: ".", // Project root
  },

  // Component generation preferences
  components: {
    namingConvention: "pascal", // PascalCase for React components
    fileExtension: "tsx", // TypeScript React files
    generateIndexFiles: true, // Generate index.ts files
    includeStories: true, // Generate Storybook stories
    includeTests: true, // Generate test files
    exportFormat: "both", // Both named and default exports
  },

  // Build optimization settings
  optimization: {
    codeSplitting: true, // Enable code splitting
    treeShaking: true, // Enable tree shaking
    minification: true, // Minify production builds
    compression: true, // Compress assets
    imageOptimization: true, // Optimize images
    fontOptimization: true, // Optimize fonts
  },

  // Development tooling
  tooling: {
    bundler: "vite", // Fast build tool
    testing: "vitest", // Fast testing framework
    linting: "eslint", // Code linting
    documentation: "storybook", // Component documentation
  },

  // Deployment configuration
  deployment: {
    target: "static", // Static site generation
    cdn: true, // Use CDN for assets
    basePath: "/", // Base path for routing
  },
};

export default buildConfig;

// Helper functions for build configuration
export function validateBuildConfig(config: BuildConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate paths use forward slashes
  const pathKeys = Object.keys(config.paths) as (keyof OutputPathsConfig)[];
  for (const key of pathKeys) {
    const path = config.paths[key];
    if (path.includes("\\")) {
      errors.push(`Path ${key} must use forward slashes, found: ${path}`);
    }
  }

  // Validate framework compatibility
  if (
    config.framework.primary === "react" &&
    config.framework.styling === "styled-components"
  ) {
    if (
      !config.framework.typescript &&
      config.components.fileExtension === "tsx"
    ) {
      errors.push("TypeScript must be enabled for .tsx files");
    }
  }

  // Validate component preferences
  if (
    config.components.namingConvention === "pascal" &&
    config.components.fileExtension === "vue"
  ) {
    errors.push("Vue components should use kebab-case naming");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Framework-specific configurations
export function getReactConfig(): BuildConfig {
  return {
    ...buildConfig,
    framework: {
      ...buildConfig.framework,
      primary: "react",
      styling: "tailwind",
    },
    components: {
      ...buildConfig.components,
      namingConvention: "pascal",
      fileExtension: "tsx",
    },
  };
}

export function getVueConfig(): BuildConfig {
  return {
    ...buildConfig,
    framework: {
      ...buildConfig.framework,
      primary: "vue",
      styling: "scss",
    },
    components: {
      ...buildConfig.components,
      namingConvention: "pascal",
      fileExtension: "vue",
    },
  };
}

export function getSvelteConfig(): BuildConfig {
  return {
    ...buildConfig,
    framework: {
      ...buildConfig.framework,
      primary: "svelte",
      styling: "css",
    },
    components: {
      ...buildConfig.components,
      namingConvention: "pascal",
      fileExtension: "svelte",
    },
  };
}

// Environment-specific configurations
export function getProductionBuildConfig(): BuildConfig {
  return {
    ...buildConfig,
    optimization: {
      ...buildConfig.optimization,
      minification: true,
      compression: true,
      imageOptimization: true,
    },
    tooling: {
      ...buildConfig.tooling,
      bundler: "vite", // Use optimized bundler for production
    },
  };
}

export function getDevelopmentBuildConfig(): BuildConfig {
  return {
    ...buildConfig,
    optimization: {
      ...buildConfig.optimization,
      minification: false, // Skip minification in development
      compression: false,
    },
    components: {
      ...buildConfig.components,
      includeStories: true,
      includeTests: true,
    },
  };
}

// Config presets for different project types
export const BUILD_PRESETS = {
  "design-system": {
    ...buildConfig,
    framework: {
      ...buildConfig.framework,
      styling: "css",
    },
    tooling: {
      ...buildConfig.tooling,
      documentation: "storybook",
    },
    components: {
      ...buildConfig.components,
      includeStories: true,
      exportFormat: "both",
    },
  },

  "web-app": {
    ...buildConfig,
    framework: {
      ...buildConfig.framework,
      stateManagement: "zustand",
    },
    deployment: {
      ...buildConfig.deployment,
      target: "spa",
    },
    tooling: {
      ...buildConfig.tooling,
      testing: "vitest",
    },
  },

  "static-site": {
    ...buildConfig,
    deployment: {
      ...buildConfig.deployment,
      target: "static",
    },
    optimization: {
      ...buildConfig.optimization,
      imageOptimization: true,
      fontOptimization: true,
    },
    tooling: {
      ...buildConfig.tooling,
      documentation: "docusaurus",
    },
  },

  "component-library": {
    ...buildConfig,
    framework: {
      ...buildConfig.framework,
      primary: "react",
      typescript: true,
    },
    components: {
      ...buildConfig.components,
      generateIndexFiles: true,
      exportFormat: "named",
      includeStories: true,
    },
    tooling: {
      ...buildConfig.tooling,
      bundler: "rollup",
      documentation: "storybook",
    },
  },
};
