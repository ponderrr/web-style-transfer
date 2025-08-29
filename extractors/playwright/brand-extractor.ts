// Brand Extractor
// extractors/playwright/brand-extractor.ts
import { chromium, Browser, Page, BrowserContext } from 'playwright';
// import * as fs from "fs/promises";
// import * as path from "path";
import {
  // BrandProfile,
  ContentInventory,
  InformationArchitecture,
  VoiceTone,
  SEOMetadata,
  BrandExtractionResult,
} from '../schemas/brand.schema';

// Import DOM sampling utilities
import { ColorNormalizer } from './utils/color-normalizer';
import { TypographyAnalyzer } from './utils/typography-analyzer';

export class BrandExtractor {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private visitedUrls: Set<string> = new Set();
  private maxPages: number = 50; // Limit crawling depth

  // Operational parameters
  private _baseURL?: string;
  private _maxDepth: number = 3;
  private _respectRobots: boolean = true;
  private _rateLimit: number = 1000; // ms between requests

  // Property getters/setters
  get baseURL(): string | undefined {
    return this._baseURL;
  }

  set baseURL(value: string | undefined) {
    this._baseURL = value;
  }

  get maxDepth(): number {
    return this._maxDepth;
  }

  set maxDepth(value: number) {
    this._maxDepth = value;
  }

  get respectRobots(): boolean {
    return this._respectRobots;
  }

  set respectRobots(value: boolean) {
    this._respectRobots = value;
  }

  get rateLimit(): number {
    return this._rateLimit;
  }

  set rateLimit(value: number) {
    this._rateLimit = value;
  }

  // DOM sampling utilities
  private colorNormalizer: ColorNormalizer;
  private typographyAnalyzer: TypographyAnalyzer;

  // Voice and tone indicators
  private readonly VOICE_INDICATORS = {
    professional: ['enterprise', 'solution', 'industry-leading', 'robust', 'comprehensive'],
    casual: ['hey', 'awesome', 'cool', 'fun', 'easy'],
    technical: ['API', 'SDK', 'implementation', 'architecture', 'framework'],
    friendly: ['welcome', 'happy', 'help', 'together', 'community'],
    authoritative: ['expert', 'leading', 'trusted', 'proven', 'guaranteed'],
    innovative: ['cutting-edge', 'revolutionary', 'next-generation', 'transform', 'pioneer'],
    minimalist: ['simple', 'clean', 'essential', 'pure', 'focused'],
  };

  constructor(
    options: {
      baseURL?: string;
      maxDepth?: number;
      respectRobots?: boolean;
      rateLimit?: number;
      maxPages?: number;
    } = {}
  ) {
    // Set operational parameters
    this.baseURL = options.baseURL;
    this.maxDepth = options.maxDepth ?? 3;
    this.respectRobots = options.respectRobots ?? true;
    this.rateLimit = options.rateLimit ?? 1000;
    this.maxPages = options.maxPages ?? 50;

    // Initialize DOM sampling utilities
    this.colorNormalizer = new ColorNormalizer();
    this.typographyAnalyzer = new TypographyAnalyzer();
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.context = await this.browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: 'Mozilla/5.0 (Compatible; BrandExtractor/1.0; +http://example.com/bot)',
      });
    } catch (error) {
      console.error('❌ Failed to initialize BrandExtractor browser:', error);
      throw new Error(
        `BrandExtractor browser initialization failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async extract(url: string): Promise<BrandExtractionResult> {
    if (!this.context) await this.initialize();

    console.log(`📚 Starting brand and content extraction for: ${url}`);

    // Check robots.txt if enabled
    if (this.respectRobots) {
      const allowed = await this.checkRobotsTxt(url);
      if (!allowed) {
        throw new Error(`Robots.txt disallows access to: ${url}`);
      }
    }

    // Check baseURL scope if specified
    if (this.baseURL && !url.startsWith(this.baseURL)) {
      console.warn(`⚠️ URL ${url} is outside baseURL scope: ${this.baseURL}`);
    }

    const startTime = Date.now();
    const _baseUrl = new URL(url).origin;

    try {
      // Extract from main page
      const mainPage = await this.context!.newPage();
      await mainPage.goto(url, { waitUntil: 'networkidle' });

      // Extract brand identity
      const brandIdentity = await this.extractBrandIdentity(mainPage);

      // Extract navigation structure for IA
      const informationArchitecture = await this.extractIA(mainPage, _baseUrl);

      // Crawl and extract content from key pages
      const contentInventory = await this.crawlAndExtractContent(_baseUrl, informationArchitecture);

      // Analyze voice and tone
      const voiceTone = this.analyzeVoiceTone(contentInventory);

      // Extract SEO metadata
      const seoMetadata = await this.extractSEOMetadata(mainPage);

      await mainPage.close();

      const result: BrandExtractionResult = {
        url,
        timestamp: new Date().toISOString(),
        brand: {
          ...brandIdentity,
          voice: voiceTone,
        },
        informationArchitecture,
        contentInventory,
        seoMetadata: seoMetadata as any,
        recommendations: [],
        qualityScore: {
          brandClarity: 0,
          contentQuality: 0,
          informationArchitecture: 0,
          seoOptimization: 0,
          messagingConsistency: 0,
          overall: 0,
        },
        metadata: {
          extractionDuration: Date.now() - startTime,
          pagesCrawled: this.visitedUrls.size,
          contentTypesDetected: ['landing'],
          extractorVersion: '1.0.0',
        },
      };

      console.log(`✅ Brand extraction complete. Analyzed ${this.visitedUrls.size} pages`);
      return result;
    } catch (error) {
      console.error('Brand extraction error:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private async extractBrandIdentity(page: Page): Promise<any> {
    console.log('🎨 Analyzing brand identity with advanced DOM sampling...');

    // Use DOM sampling utilities for enhanced analysis
    await this.colorNormalizer.normalizeColors(
      ['#000000'] // Default colors
    );
    await this.typographyAnalyzer.analyzeTypography(page);

    return await page.evaluate(() => {
      const identity: any = {};

      // Extract site name
      identity.name =
        document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        document.querySelector('.logo')?.textContent?.trim() ||
        ((document.title || 'Untitled').split(/[-|–]/)[0] || 'Untitled').trim();

      // Extract tagline
      const taglineSelectors = [
        '.tagline',
        '.slogan',
        '.subtitle',
        'h2',
        '.hero p',
        '[class*="tagline"]',
        '[class*="slogan"]',
      ];
      for (const selector of taglineSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.length < 100) {
          identity.tagline = element.textContent.trim();
          break;
        }
      }

      // Extract logo
      const logo = document.querySelector('.logo img, [class*="logo"] img, header img');
      if (logo) {
        const logoImg = logo as HTMLImageElement;
        identity.logo = {
          src: logoImg.src || '',
          alt: logoImg.alt || '',
        };
      }

      // Extract theme color with enhanced analysis
      const themeColor = document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute('content');
      if (themeColor) {
        identity.themeColor = themeColor;
      }

      // Extract social links
      const socialLinks: any = {};
      const socialPatterns = {
        twitter: /twitter\.com|x\.com/i,
        linkedin: /linkedin\.com/i,
        facebook: /facebook\.com/i,
        instagram: /instagram\.com/i,
        youtube: /youtube\.com/i,
        github: /github\.com/i,
      };

      document.querySelectorAll('a[href*="://"]').forEach(link => {
        const href = (link as HTMLAnchorElement).href;
        for (const [platform, pattern] of Object.entries(socialPatterns)) {
          if (pattern.test(href)) {
            socialLinks[platform] = href;
          }
        }
      });

      if (Object.keys(socialLinks).length > 0) {
        identity.socialLinks = socialLinks;
      }

      // Extract contact info
      const email = document.querySelector('a[href^="mailto:"]');
      const phone = document.querySelector('a[href^="tel:"]');
      const address = document.querySelector('.address, [class*="address"], address');

      identity.contact = {
        email: email ? (email as HTMLAnchorElement).href.replace('mailto:', '') : null,
        phone: phone ? (phone as HTMLAnchorElement).href.replace('tel:', '') : null,
        address: address ? address.textContent?.trim() : null,
      };

      return identity;
    });
  }

  private async extractIA(page: Page, baseUrl: string): Promise<InformationArchitecture> {
    const navigation = await page.evaluate(_base => {
      const nav: any = {
        primary: [],
        footer: [],
        utility: [],
      };

      // Extract primary navigation
      const primaryNav = document.querySelector('nav, header nav, .main-nav, [role="navigation"]');
      if (primaryNav) {
        primaryNav.querySelectorAll('a').forEach(link => {
          const href = (link as HTMLAnchorElement).href;
          const text = link.textContent?.trim();
          if (text && href && !href.includes('#')) {
            nav.primary.push({
              label: text,
              url: href,
              level: 0,
            });
          }
        });
      }

      // Extract footer navigation
      const footer = document.querySelector('footer');
      if (footer) {
        footer.querySelectorAll('a').forEach(link => {
          const href = (link as HTMLAnchorElement).href;
          const text = link.textContent?.trim();
          if (text && href && !nav.primary.some((item: any) => item.url === href)) {
            nav.footer.push({
              label: text,
              url: href,
            });
          }
        });
      }

      // Extract utility navigation (login, search, etc.)
      const utilitySelectors = ['.user-menu', '.utility-nav', '.account', '[class*="login"]'];
      utilitySelectors.forEach(selector => {
        document.querySelectorAll(selector + ' a').forEach(link => {
          const href = (link as HTMLAnchorElement).href;
          const text = link.textContent?.trim();
          if (text && href) {
            nav.utility.push({
              label: text,
              url: href,
            });
          }
        });
      });

      return nav;
    }, baseUrl);

    // Build sitemap structure
    const sitemap = this.buildSitemap(navigation);

    return {
      structure: {
        primaryNavigation: navigation.primary || [],
        footerNavigation: navigation.footer || [],
        sitemap,
      },
      depth: this.calculateIADepth(sitemap),
      quality: {
        structure: { score: 0, issues: [], recommendations: [] },
        navigation: { score: 0, usability: 0, discoverability: 0 },
        content: { score: 0, organization: 0, accessibility: 0 },
        seo: { score: 0, internalLinking: 0, contentDepth: 0 },
      },
      userFlows: [],
      contentClusters: [],
      internalLinking: {
        opportunities: [],
        orphanPages: [],
        brokenLinks: [],
        linkingDepth: {
          averageLinksPerPage: 0,
          maxLinksPerPage: 0,
          linkingPatterns: {},
        },
      },
      accessibility: {
        navigation: {
          keyboardAccessible: false,
          skipLinks: false,
          focusManagement: false,
          ariaLabels: false,
        },
        content: {
          headingHierarchy: false,
          semanticStructure: false,
          altTextCoverage: 0,
        },
      },
    };
  }

  private buildSitemap(navigation: any): any {
    // Create hierarchical sitemap from flat navigation
    const sitemap: any = {
      home: {
        url: '/',
        children: [],
      },
    };

    // Add primary navigation items
    navigation.primary.forEach((item: any) => {
      sitemap.home.children.push({
        label: item.label,
        url: item.url,
        children: [],
      });
    });

    return sitemap;
  }

  private calculateIADepth(sitemap: any): any {
    let maxDepth = 0;

    const calculateDepth = (node: any, currentDepth: number = 0) => {
      maxDepth = Math.max(maxDepth, currentDepth);
      if (node.children) {
        node.children.forEach((child: any) => {
          calculateDepth(child, currentDepth + 1);
        });
      }
    };

    if (sitemap.home) {
      calculateDepth(sitemap.home);
    }

    return {
      overall: {
        averageDepth: maxDepth / 2,
        maxDepth,
        minDepth: 1,
        medianDepth: Math.floor(maxDepth / 2),
      },
      navigation: {
        primaryNavDepth: 1,
        secondaryNavDepth: 0,
        breadcrumbDepth: 0,
      },
      content: {
        averageContentDepth: 2.5,
        contentVariability: 0.8,
      },
      userJourney: {
        averagePathLength: 2.3,
        conversionFunnelDepth: 3,
        dropOffPoints: [],
      },
    };
  }

  private async crawlAndExtractContent(
    _baseUrl: string,
    ia: InformationArchitecture
  ): Promise<ContentInventory> {
    const contentInventory: ContentInventory = {
      pages: [],
      contentTypes: {},
      totalWordCount: 0,
      topics: [],
      keywords: [],
      readability: {
        averageWordsPerPage: 0,
        averageSentencesPerParagraph: 0,
        averageSyllablesPerWord: 0,
        fleschKincaidGrade: 0,
      },
    };

    // Limit crawling to key pages
    const keyPages = ia.structure.primaryNavigation.slice(0, 10);

    for (const navItem of keyPages) {
      const pageUrl = navItem.href || '';
      if (!pageUrl || this.visitedUrls.has(pageUrl)) continue;
      if (this.visitedUrls.size >= this.maxPages) break;

      try {
        const page = await this.context!.newPage();
        await page.goto(pageUrl, {
          waitUntil: 'networkidle',
          timeout: 15000,
        });

        const pageContent = await this.extractPageContent(page);
        contentInventory.pages.push({
          url: pageUrl,
          title: pageContent.title,
          content: pageContent,
          wordCount: this.countWords(pageContent),
        });

        this.visitedUrls.add(pageUrl);
        await page.close();

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`Failed to extract content from ${pageUrl}:`, error);
      }
    }

    // Calculate total word count
    contentInventory.totalWordCount = contentInventory.pages.reduce(
      (sum, page) => sum + page.wordCount,
      0
    );

    // Categorize content types
    this.categorizeContentTypes(contentInventory);

    return contentInventory;
  }

  private async extractPageContent(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const content: any = {
        title: document.title,
        headings: {},
        paragraphs: [],
        lists: [],
        buttons: [],
        images: [],
        meta: {},
      };

      // Extract headings hierarchy
      ['h1', 'h2', 'h3', 'h4'].forEach(tag => {
        const headings = Array.from(document.querySelectorAll(tag))
          .map(el => el.textContent?.trim())
          .filter(text => text && text.length > 0);
        if (headings.length > 0) {
          content.headings[tag] = headings;
        }
      });

      // Extract paragraphs
      content.paragraphs = Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 20)
        .slice(0, 20); // Limit to first 20 paragraphs

      // Extract lists
      document.querySelectorAll('ul, ol').forEach(list => {
        const items = Array.from(list.querySelectorAll('li'))
          .map(li => li.textContent?.trim())
          .filter(text => text);
        if (items.length > 0) {
          content.lists.push(items);
        }
      });

      // Extract CTAs and buttons
      content.buttons = Array.from(document.querySelectorAll('button, .btn, [class*="button"]'))
        .map(btn => ({
          text: btn.textContent?.trim(),
          type: btn.classList.contains('primary') ? 'primary' : 'secondary',
        }))
        .filter(btn => btn.text);

      // Extract images with alt text
      content.images = Array.from(document.querySelectorAll('img'))
        .map(img => ({
          alt: (img as HTMLImageElement).alt,
          src: (img as HTMLImageElement).src,
        }))
        .filter(img => img.alt);

      // Extract meta description
      content.meta.description = document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content');
      content.meta.keywords = document
        .querySelector('meta[name="keywords"]')
        ?.getAttribute('content');

      return content;
    });
  }

  private countWords(content: any): number {
    let wordCount = 0;

    // Count words in headings
    Object.values(content.headings || {}).forEach((headings: any) => {
      headings.forEach((text: string) => {
        wordCount += text.split(/\s+/).length;
      });
    });

    // Count words in paragraphs
    (content.paragraphs || []).forEach((text: string) => {
      wordCount += text.split(/\s+/).length;
    });

    // Count words in lists
    (content.lists || []).forEach((list: string[]) => {
      list.forEach((item: string) => {
        wordCount += item.split(/\s+/).length;
      });
    });

    return wordCount;
  }

  private categorizeContentTypes(inventory: ContentInventory): void {
    const types = new Map<string, number>();

    inventory.pages.forEach(page => {
      // Detect content type based on URL and content
      if (page.url.includes('about')) {
        types.set('about', (types.get('about') || 0) + 1);
      } else if (page.url.includes('blog') || page.url.includes('article')) {
        types.set('blog', (types.get('blog') || 0) + 1);
      } else if (page.url.includes('product') || page.url.includes('feature')) {
        types.set('product', (types.get('product') || 0) + 1);
      } else if (page.url.includes('pricing')) {
        types.set('pricing', (types.get('pricing') || 0) + 1);
      } else if (page.url.includes('contact')) {
        types.set('contact', (types.get('contact') || 0) + 1);
      } else {
        types.set('general', (types.get('general') || 0) + 1);
      }
    });

    inventory.contentTypes = Object.fromEntries(types);
  }

  private analyzeVoiceTone(inventory: ContentInventory): VoiceTone {
    const voiceScores: Map<string, number> = new Map();

    // Analyze all text content for voice indicators
    inventory.pages.forEach(page => {
      const allText = [
        ...page.content.paragraphs,
        ...Object.values(page.content.headings).flat(),
        ...page.content.buttons.map((b: any) => b.text),
      ]
        .join(' ')
        .toLowerCase();

      // Score each voice type
      Object.entries(this.VOICE_INDICATORS).forEach(([voice, indicators]) => {
        let score = 0;
        indicators.forEach(indicator => {
          if (allText.includes(indicator)) {
            score++;
          }
        });
        voiceScores.set(voice, (voiceScores.get(voice) || 0) + score);
      });
    });

    // Determine primary voice
    let primaryVoice = 'professional';
    let maxScore = 0;
    voiceScores.forEach((score, voice) => {
      if (score > maxScore) {
        maxScore = score;
        primaryVoice = voice;
      }
    });

    // Analyze formality
    const formalityScore = this.analyzeFormalityLevel(inventory);

    return {
      primary: primaryVoice,
      attributes: Array.from(voiceScores.keys()).filter(v => voiceScores.get(v)! > 0),
      formality: formalityScore > 0.7 ? 'formal' : formalityScore > 0.4 ? 'neutral' : 'casual',
      personality: this.derivePersonality(primaryVoice, formalityScore),
    };
  }

  private analyzeFormalityLevel(inventory: ContentInventory): number {
    let formalIndicators = 0;
    let casualIndicators = 0;

    inventory.pages.forEach(page => {
      const text = page.content.paragraphs.join(' ').toLowerCase();

      // Formal indicators
      if (text.includes('we provide') || text.includes('our solution')) formalIndicators++;
      if (text.includes('enterprise') || text.includes('professional')) formalIndicators++;
      if (!text.includes("don't") && !text.includes("won't")) formalIndicators++;

      // Casual indicators
      if (text.includes("you'll") || text.includes("we'll")) casualIndicators++;
      if (text.includes('!')) casualIndicators++;
      if (text.includes('awesome') || text.includes('cool')) casualIndicators++;
    });

    const total = formalIndicators + casualIndicators;
    return total > 0 ? formalIndicators / total : 0.5;
  }

  private derivePersonality(voice: string, formality: number): string {
    if (voice === 'professional' && formality > 0.7) return 'corporate';
    if (voice === 'casual' && formality < 0.4) return 'playful';
    if (voice === 'technical') return 'expert';
    if (voice === 'friendly') return 'approachable';
    if (voice === 'innovative') return 'visionary';
    return 'balanced';
  }

  private async extractSEOMetadata(page: Page): Promise<SEOMetadata> {
    return await page.evaluate(() => {
      const seo: any = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
        openGraph: {},
        twitter: {},
        structuredData: [],
      };

      // Open Graph tags
      document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property')?.replace('og:', '');
        const content = meta.getAttribute('content');
        if (property && content) {
          seo.openGraph[property] = content;
        }
      });

      // Twitter cards
      document.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
        const name = meta.getAttribute('name')?.replace('twitter:', '');
        const content = meta.getAttribute('content');
        if (name && content) {
          seo.twitter[name] = content;
        }
      });

      // JSON-LD structured data
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          seo.structuredData.push(data);
        } catch (e) {
          // Invalid JSON
        }
      });

      // Canonical URL
      seo.canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

      // Language
      seo.language = document.documentElement.lang || 'en';

      return seo;
    });
  }

  private async checkRobotsTxt(url: string): Promise<boolean> {
    try {
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;

      const response = await fetch(robotsUrl);
      if (!response.ok) {
        // If robots.txt doesn't exist, assume access is allowed
        return true;
      }

      const robotsTxt = await response.text();

      // Simple robots.txt parser
      const lines = (robotsTxt || '').split('\n');
      let currentUserAgent = '';
      const disallowed: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('User-agent:')) {
          const userAgent = trimmed.split(':')[1];
          if (userAgent) {
            currentUserAgent = userAgent.trim();
          }
        } else if (trimmed.startsWith('Disallow:') && currentUserAgent === '*') {
          const path = trimmed.split(':')[1];
          if (path && path.trim()) {
            disallowed.push(path.trim());
          }
        }
      }

      // Check if our path is disallowed
      const urlPath = urlObj.pathname + urlObj.search;
      for (const disallowedPath of disallowed) {
        if (urlPath.startsWith(disallowedPath)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      // If we can't check robots.txt, assume access is allowed
      console.warn(`⚠️ Could not check robots.txt for ${url}:`, error);
      return true;
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }
}

// Export for CLI usage
export default BrandExtractor;
