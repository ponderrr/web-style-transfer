// Style Schema
// extractors/schemas/style.schema.ts

// Base token types
export interface ColorToken {
  $value: string;
  $type: 'color';
  contrast?: number;
  usage?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

export interface TypographyToken {
  $value?: string;
  $type?: 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing';
  fontFamily?: { $value: string; $type: 'fontFamily' };
  fontSize?: { $value: string; $type: 'fontSize' };
  fontWeight?: { $value: string | number; $type: 'fontWeight' };
  lineHeight?: { $value: string | number; $type: 'lineHeight' };
  letterSpacing?: { $value: string; $type: 'letterSpacing' };
  textTransform?: { $value: string; $type: 'textTransform' };
}

export interface SpacingToken {
  $value: string;
  $type: 'spacing';
}

export interface BorderRadiusToken {
  $value: string;
  $type: 'borderRadius';
}

export interface ShadowToken {
  $value: string;
  $type: 'boxShadow';
}

export interface FontFamily {
  name: string;
  stack: string[];
  fallback: boolean;
}

// Enhanced schemas
export interface ColorSystem {
  primary?: ColorToken;
  secondary?: ColorToken;
  accent?: ColorToken;
  neutral?: Record<string, ColorToken>;
  semantic?: {
    success?: ColorToken;
    warning?: ColorToken;
    error?: ColorToken;
    info?: ColorToken;
  };
  [key: string]: any;
}

export interface TypographyScale {
  [key: string]: {
    size: string;
    lineHeight?: string | number;
    fontFamily?: string;
    fontWeight?: number;
    letterSpacing?: string;
  };
}

export interface Typography {
  family?: FontFamily[];
  scale?: TypographyScale;
  weights?: Record<string, number>;
  features?: string[];
  modularScale?: {
    ratio: number;
    baseSize: number;
  };
}

export interface SpacingScale {
  [key: string]: string | number;
}

export interface SpacingSystem {
  base: string;
  scale: SpacingScale;
  usage?: Record<string, number[]>;
  recommendations?: string[];
}

export interface BorderRadiusScale {
  [key: string]: string;
}

export interface ShadowScale {
  [key: string]: string;
}

export interface EffectsSystem {
  shadows?: ShadowScale;
  transitions?: Record<string, string>;
  animations?: Record<string, string>;
  transforms?: Record<string, string>;
  filters?: Record<string, string>;
  backdropFilters?: Record<string, string>;
}

export interface Breakpoints {
  [key: string]: string;
}

export interface GridSystem {
  columns?: number;
  gutter?: string;
  container?: string;
  breakpoints?: Record<string, string>;
}

// Layout-specific types
export interface FlexSystem {
  display: Record<string, string>; // flex, inline-flex, etc.
  direction: Record<string, string>; // row, column, row-reverse, etc.
  wrap: Record<string, string>; // nowrap, wrap, wrap-reverse
  justify: Record<string, string>; // flex-start, center, space-between, etc.
  align: Record<string, string>; // stretch, flex-start, center, etc.
  gap: Record<string, string>; // spacing scale values
}

export interface PositioningSystem {
  position: Record<string, string>; // static, relative, absolute, fixed
  top: Record<string, string>; // spacing scale values
  right: Record<string, string>; // spacing scale values
  bottom: Record<string, string>; // spacing scale values
  left: Record<string, string>; // spacing scale values
  inset: Record<string, string>; // spacing scale values
}

export interface OverflowSystem {
  overflow: Record<string, string>; // visible, hidden, scroll, auto
  overflowX: Record<string, string>; // visible, hidden, scroll, auto
  overflowY: Record<string, string>; // visible, hidden, scroll, auto
  textOverflow: Record<string, string>; // clip, ellipsis
}

export interface ZIndexSystem {
  layers: Record<string, number>; // base, dropdown, sticky, modal, etc.
}

export interface LayoutSystem {
  grid?: GridSystem;
  flex?: FlexSystem;
  positioning?: PositioningSystem;
  overflow?: OverflowSystem;
  zIndex?: ZIndexSystem;
  display?: Record<string, string>; // block, inline, flex, grid, etc.
  container?: Record<string, string>; // max-width values for containers
}

// Page hints and guidance types
export interface PageHints {
  layout: {
    type: 'full-width' | 'contained' | 'split' | 'grid' | 'flex';
    container?: string;
    maxWidth?: string;
    padding?: Record<string, string>;
    background?: string;
    columns?: number;
  };
  typography: {
    primaryHeading?: string; // Font family for H1
    bodyText?: string; // Font family for body
    accentText?: string; // Font family for emphasis
    scale?: Record<string, string>; // Heading scale overrides
  };
  spacing: {
    sectionSpacing?: string;
    elementSpacing?: string;
    contentPadding?: Record<string, string>;
  };
  color: {
    background?: string;
    text?: string;
    accent?: string;
    theme?: 'light' | 'dark' | 'auto';
  };
  components: {
    primaryCTA?: string; // Preferred CTA style
    navigation?: string; // Navigation component hint
    footer?: string; // Footer component hint
  };
  responsive: {
    breakpoints?: string[];
    mobileFirst?: boolean;
    tabletLayout?: string;
    desktopLayout?: string;
  };
  accessibility: {
    skipLinks?: boolean;
    focusIndicators?: boolean;
    semanticStructure?: boolean;
    altText?: boolean;
  };
}

// Component and pattern types
export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  styles: Record<string, string>;
}

export interface ComponentSpec {
  name: string;
  type: 'atom' | 'molecule' | 'organism' | 'template' | 'page';
  pattern?: UIPattern;
  variants: ComponentVariant[];
  props: Record<string, any>;
  styles: Record<string, string>;
  accessibility: {
    roles?: string[];
    labels?: string[];
    keyboard?: string[];
    screenReader?: string[];
  };
  responsive: {
    breakpoints: string[];
    behaviors: Record<string, string>;
  };
  content?: any;
}

export interface UIPattern {
  type: 'navigation' | 'hero' | 'cards' | 'form' | 'table' | 'pricing' | 'footer';
  variant: string;
  confidence: number;
  selector: string;
  element?: any; // Playwright ElementHandle
  properties: {
    layout?: 'grid' | 'flex' | 'block';
    columns?: number;
    spacing?: string;
    responsive?: boolean;
  };
  accessibility: {
    hasAriaLabels: boolean;
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

// Quality and analysis types
export interface QualityScore {
  overall: number; // 0-1 scale
  breakdown: {
    colorConsistency: number;
    typographyHierarchy: number;
    spacingRegularity: number;
    accessibilityCompliance: number;
    patternConsistency: number;
    performanceOptimization: number;
    modernityScore: number;
  };
  recommendations: string[];
}

export interface AccessibilityReport {
  score: number; // 0-100
  violations: AccessibilityViolation[];
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  recommendations: string[];
}

export interface AccessibilityViolation {
  rule: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  element: string;
  guideline: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

export interface PerformanceReport {
  score: number; // 0-100
  metrics: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    tti: number; // Time to Interactive
    tbt: number; // Total Blocking Time
    cls: number; // Cumulative Layout Shift
    speedIndex: number; // Speed Index
  };
  budget: {
    fcp: number;
    lcp: number;
    tti: number;
    tbt: number;
    cls: number;
    speedIndex: number;
  };
  compliance: {
    fcp: 'pass' | 'warning' | 'fail';
    lcp: 'pass' | 'warning' | 'fail';
    tti: 'pass' | 'warning' | 'fail';
    tbt: 'pass' | 'warning' | 'fail';
    cls: 'pass' | 'warning' | 'fail';
    speedIndex: 'pass' | 'warning' | 'fail';
  };
  recommendations: string[];
}

// Main design tokens interface
export interface DesignTokens {
  colors?: ColorSystem;
  typography?: Typography;
  spacing?: SpacingSystem;
  borderRadius?: BorderRadiusScale;
  effects?: EffectsSystem;
  breakpoints?: Breakpoints;
  grid?: GridSystem;
  layout?: LayoutSystem;
  pageHints?: PageHints;
  components?: ComponentSpec[];
  [key: string]: any; // Allow additional custom tokens
}

// Extraction result types
export interface ExtractionResult {
  url: string;
  timestamp: string;
  tokens: DesignTokens;
  patterns: UIPattern[];
  interactions?: InteractionPattern[];
  qualityScore: QualityScore;
  accessibility?: AccessibilityReport;
  performance?: PerformanceReport;
  recommendations: string[];
  metadata: {
    extractionDuration: number;
    viewportsTested: string[];
    extractorVersion: string;
  };
}

export interface InteractionPattern {
  type: 'hover' | 'focus' | 'click' | 'drag' | 'scroll' | 'keyboard';
  element: string;
  trigger: string;
  effect: string;
  duration?: number;
  easing?: string;
}

// Configuration types
export interface ExtractionConfig {
  viewports: {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
  };
  quality: {
    minScore: number;
    requireAccessibility: boolean;
    maxExtractionTime: number;
    screenshotQuality: number;
  };
  crawling: {
    maxPages: number;
    maxDepth: number;
    rateLimit: number;
    timeout: number;
    respectRobotsTxt: boolean;
    userAgent: string;
  };
  patterns: {
    minConfidence: number;
    detectVariants: boolean;
    maxPatternsPerType: number;
  };
  output: {
    format: 'json' | 'yaml';
    includeScreenshots: boolean;
    compressAssets: boolean;
    generateReport: boolean;
  };
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Export convenience types
export type ColorValue = string;
export type SpacingValue = string | number;
export type TypographyValue = string | number;
export type BorderRadiusValue = string | number;
export type ShadowValue = string;
export type BreakpointValue = string | number;

// Collection types for design systems
export interface DesignSystem {
  name: string;
  version: string;
  tokens: DesignTokens;
  components: ComponentSpec[];
  patterns: UIPattern[];
  guidelines: {
    accessibility: string[];
    performance: string[];
    responsive: string[];
    branding: string[];
  };
}

export interface DesignSystemCollection {
  systems: DesignSystem[];
  metadata: {
    created: string;
    updated: string;
    version: string;
    author?: string;
    license?: string;
  };
}

// Legacy compatibility
export interface LegacyDesignTokens {
  colors: {
    primary: Record<string, ColorToken>;
    neutral: Record<string, ColorToken>;
    semantic: Record<string, ColorToken>;
    accent?: Record<string, ColorToken>;
  };
  typography: {
    headings: Record<string, TypographyToken>;
    body: TypographyToken;
    small: TypographyToken;
  };
  spacing: SpacingSystem; // Updated for consistency
  effects: {
    shadows: Record<string, string>;
    transitions: Record<string, string>;
    transforms?: Record<string, string>;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
  };
}

// File ends here

// extractors/schemas/brand.schema.ts

export interface BrandIdentity {
  name: string;
  tagline?: string;
  logo?: {
    src: string;
    alt: string;
  };
  themeColor?: string;
  socialLinks?: Record<string, string>;
  contact?: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  };
}

export interface VoiceTone {
  primary: string;
  attributes: string[];
  formality: 'formal' | 'neutral' | 'casual';
  personality: string;
}

export interface BrandProfile extends BrandIdentity {
  voice: VoiceTone;
}

export interface PageContent {
  url: string;
  title: string;
  content: {
    title: string;
    headings: Record<string, string[]>;
    paragraphs: string[];
    lists: string[][];
    buttons: Array<{ text: string; type: string }>;
    images: Array<{ alt: string; src: string }>;
    meta: {
      description?: string;
      keywords?: string;
    };
  };
  wordCount: number;
}

export interface ContentInventory {
  pages: PageContent[];
  contentTypes: Map<string, number>;
  totalWordCount: number;
}

export interface InformationArchitecture {
  navigation: {
    primary: Array<{ label: string; url: string; level: number }>;
    footer: Array<{ label: string; url: string }>;
    utility: Array<{ label: string; url: string }>;
  };
  sitemap: any;
  depth: number;
}

export interface SEOMetadata {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  language: string;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  structuredData: any[];
}

export interface ConversionPatterns {
  ctas: Array<{
    text: string;
    type: string;
    location: string;
  }>;
  forms: Array<{
    fields: number;
    submitText?: string;
    purpose: string;
  }>;
  pricing?: {
    tiers: number;
    hasFree: boolean;
    hasEnterprise: boolean;
  };
  testimonials: Array<{
    text: string;
    hasAuthor: boolean;
  }>;
}

export interface BrandExtractionResult {
  url: string;
  timestamp: string;
  brand: BrandProfile;
  informationArchitecture: InformationArchitecture;
  contentInventory: ContentInventory;
  seoMetadata: SEOMetadata;
  conversionPatterns: ConversionPatterns;
  metadata: {
    pagesAnalyzed: number;
    extractionDuration: number;
  };
}
