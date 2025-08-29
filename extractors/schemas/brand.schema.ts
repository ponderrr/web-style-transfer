// Brand Schema
// extractors/schemas/brand.schema.ts

// Brand identity and voice
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
  indicators?: string[];
}

export interface BrandProfile extends BrandIdentity {
  voice: VoiceTone;
  mission?: string;
  values?: string[];
  targetAudience?: string;
  uniqueValueProposition?: string;
}

// Content and structure
export interface PageContent {
  url: string;
  title: string;
  content: {
    title: string;
    headings: Record<string, string[]>;
    paragraphs: string[];
    lists: string[][];
    buttons: Array<{ text: string; type: string; href?: string }>;
    images: Array<{ alt: string; src: string; caption?: string }>;
    links: Array<{ text: string; href: string; external?: boolean }>;
    seo: BasicMetaData; // Standardized SEO metadata
  };
  wordCount: number;
  readingTime?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  seo?: SEOMetadata; // Optional advanced SEO data
}

export interface ContentInventory {
  pages: PageContent[];
  contentTypes: Record<string, number>;
  topics: Array<{ topic: string; frequency: number; pages: string[] }>;
  keywords: Array<{ word: string; frequency: number; relevance: number }>;
  totalWordCount?: number;
  readability: {
    averageWordsPerPage: number;
    averageSentencesPerParagraph: number;
    averageSyllablesPerWord: number;
    fleschKincaidGrade: number;
  };
}

// Information architecture
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  external?: boolean;
  icon?: string;
}

export interface SiteStructure {
  primaryNavigation: NavigationItem[];
  footerNavigation: NavigationItem[];
  breadcrumbs?: NavigationItem[][];
  sitemap: Record<string, PageContent>;
}

// Depth Analysis Types
export interface SiteDepthMetrics {
  overall: {
    averageDepth: number;
    maxDepth: number;
    minDepth: number;
    medianDepth: number;
  };
  navigation: {
    primaryNavDepth: number;
    secondaryNavDepth: number;
    breadcrumbDepth: number;
  };
  content: {
    averageContentDepth: number; // Average paragraphs/sections per page
    contentVariability: number; // Standard deviation of content depth
  };
  userJourney: {
    averagePathLength: number; // Average steps to complete tasks
    conversionFunnelDepth: number; // Steps in conversion process
  };
}

export interface ArchitectureQualityMetrics {
  structure: {
    score: number; // 0-100
    issues: string[];
    recommendations: string[];
  };
  navigation: {
    score: number; // 0-100
    usability: number; // Ease of finding information
    discoverability: number; // How well content is surfaced
  };
  content: {
    score: number; // 0-100
    organization: number; // How well content is organized
    accessibility: number; // Content accessibility score
  };
  seo: {
    score: number; // 0-100
    internalLinking: number; // Quality of internal linking
    contentDepth: number; // SEO content depth score
  };
}

export interface InformationArchitecture {
  structure: SiteStructure;
  depth: SiteDepthMetrics; // Added depth analysis
  quality: ArchitectureQualityMetrics; // Added quality metrics
  userFlows: Array<{
    name: string;
    steps: Array<{ page: string; action: string; description: string }>;
    conversionRate?: number;
    complexity: number; // 1-10 scale of flow complexity
    dropOffPoints: string[]; // Pages where users commonly exit
  }>;
  contentClusters: Array<{
    cluster: string;
    pages: string[];
    keywords: string[];
    pillarContent?: string;
    authority: number; // 0-100 content authority score
    userIntent: string; // Commercial, informational, navigational
  }>;
  internalLinking: {
    opportunities: Array<{ from: string; to: string; anchor: string }>;
    orphanPages: string[];
    brokenLinks: string[]; // Added broken link detection
    linkingDepth: {
      averageLinksPerPage: number;
      maxLinksPerPage: number;
      linkingPatterns: Record<string, number>; // Link type distribution
    };
  };
  accessibility: {
    navigation: {
      keyboardAccessible: boolean;
      skipLinks: boolean;
      focusManagement: boolean;
      ariaLabels: boolean;
    };
    content: {
      headingHierarchy: boolean;
      semanticStructure: boolean;
      altTextCoverage: number; // Percentage of images with alt text
    };
  };
}

// SEO and metadata
export interface BasicMetaData {
  description?: string;
  keywords?: string;
  author?: string;
  published?: string;
  modified?: string;
  language?: string;
}

export interface AdvancedSEOMetadata {
  title?: string;
  titleTemplate?: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  structuredData?: Array<{
    type: string;
    data: Record<string, any>;
  }>;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  jsonLd?: any[];
}

// Unified SEO metadata interface
export interface SEOMetadata extends BasicMetaData, AdvancedSEOMetadata {
  // Inherits all fields from BasicMetaData and AdvancedSEOMetadata
}

// Site-level SEO configuration
export interface SiteSEOMetadata {
  titleTemplates: Record<string, string>; // Page type to title template mapping
  metaDescriptions: Record<string, string>; // Page path to description mapping
  canonicalUrls: Record<string, string>; // Page path to canonical URL mapping
  robotsTxt: string; // Site-wide robots.txt content
  sitemapXml: string; // Site-wide sitemap.xml content
  defaultMeta: BasicMetaData; // Default metadata for all pages
}

// Brand voice and messaging
export interface MessagingFramework {
  keyMessages: Array<{
    message: string;
    audience: string;
    channel: string;
    proofPoints: string[];
  }>;
  valuePropositions: Array<{
    headline: string;
    subheadline: string;
    benefits: string[];
    socialProof?: string;
  }>;
  objectionHandling: Record<string, string>;
  callsToAction: Array<{
    primary: string;
    secondary: string;
    context: string;
  }>;
}

// Analytics and performance
export interface BrandMetrics {
  awareness: {
    brandRecall: number;
    brandRecognition: number;
    shareOfVoice: number;
  };
  perception: {
    brandLove: number;
    netPromoterScore: number;
    brandTrust: number;
  };
  performance: {
    websiteTraffic: number;
    conversionRate: number;
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
  };
}

// Comprehensive brand extraction result
export interface BrandExtractionResult {
  url: string;
  timestamp: string;
  brand: BrandProfile;
  contentInventory: ContentInventory;
  informationArchitecture: InformationArchitecture;
  seoMetadata: SiteSEOMetadata; // Standardized site-level SEO
  messaging?: MessagingFramework;
  metrics?: BrandMetrics;
  recommendations: string[];
  pages?: PageContent[]; // Legacy compatibility
  voiceTone?: VoiceTone; // Legacy compatibility
  qualityScore: {
    brandClarity: number;
    contentQuality: number;
    informationArchitecture: number;
    seoOptimization: number;
    messagingConsistency: number;
    overall: number;
  };
  metadata: {
    extractionDuration: number;
    pagesCrawled: number;
    contentTypesDetected: string[];
    extractorVersion: string;
  };
}

// Legacy compatibility
export interface LegacyBrandProfile {
  name: string;
  tagline?: string;
  logo?: string;
  themeColor?: string;
  voiceTone: {
    primary: string;
    attributes: string[];
  };
}

export interface LegacyContentInventory {
  pages: Array<{
    url: string;
    title: string;
    content: string;
    wordCount: number;
  }>;
  keywords: string[];
}

// Brand analysis types
export interface BrandAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  competitiveAdvantages: string[];
  improvementAreas: string[];
}

export interface BrandConsistency {
  visualConsistency: number;
  messagingConsistency: number;
  experienceConsistency: number;
  overallConsistency: number;
  issues: Array<{
    type: 'visual' | 'messaging' | 'experience';
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }>;
}

// Brand voice detection
export interface VoiceDetectionResult {
  detectedTone:
    | 'professional'
    | 'casual'
    | 'technical'
    | 'friendly'
    | 'authoritative'
    | 'innovative'
    | 'minimalist';
  confidence: number;
  indicators: Array<{
    word: string;
    frequency: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
  recommendations: string[];
}

// Content strategy types
export interface ContentStrategy {
  contentTypes: Array<{
    type: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    audience: string;
    goals: string[];
    examples: string[];
  }>;
  editorialCalendar: Array<{
    date: string;
    content: string;
    type: string;
    audience: string;
    goals: string[];
  }>;
  contentGaps: string[];
  contentOpportunities: string[];
}

// Brand guidelines generation
export interface BrandGuidelines {
  logo: {
    primary: string;
    variations: string[];
    minimumSize: string;
    clearSpace: string;
    usage: {
      do: string[];
      dont: string[];
    };
  };
  colors: {
    primary: string;
    secondary: string[];
    accent: string[];
    usage: Record<string, string>;
  };
  typography: {
    primaryFont: string;
    secondaryFont?: string;
    scale: Record<string, string>;
    usage: Record<string, string>;
  };
  imagery: {
    style: string;
    mood: string;
    usage: {
      do: string[];
      dont: string[];
    };
  };
  voice: {
    personality: string;
    tone: string;
    guidelines: string[];
    examples: Array<{
      do: string;
      dont: string;
    }>;
  };
}

// MessagingSpec alias for MessagingFramework (used in spec.schema.ts)
export type MessagingSpec = MessagingFramework;

// Export convenience types
export type BrandValue = string;
export type VoiceAttribute = string;
export type ContentType = string;
export type SEOKeyword = string;
export type BrandColor = string;
export type TypographyScale = Record<string, string>;
export type MetaData = BasicMetaData;
export type SEOData = SEOMetadata;
export type SiteSEOData = SiteSEOMetadata;

// Collection types
export interface BrandCollection {
  brands: BrandProfile[];
  metadata: {
    created: string;
    updated: string;
    version: string;
    author?: string;
  };
}

// Integration types for design systems
export interface BrandDesignSystem {
  brand: BrandProfile;
  designTokens: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    spacing: Record<string, string>;
    effects: Record<string, string>;
  };
  components: Array<{
    name: string;
    usage: string;
    brandAlignment: number;
  }>;
  guidelines: BrandGuidelines;
}
