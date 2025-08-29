import { Page, ElementHandle } from 'playwright';
import { UIPattern } from '../schemas/style.schema';

export class PatternDetector {
  private readonly MIN_CONFIDENCE = 0.7;

  async detectPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    try {
      // Detect all pattern types
      const allPatterns = await Promise.all([
        this.detectNavigationPatterns(page),
        this.detectHeroPatterns(page),
        this.detectCardPatterns(page),
        this.detectFormPatterns(page),
        this.detectTablePatterns(page),
        this.detectPricingPatterns(page),
        this.detectFooterPatterns(page),
      ]);

      // Flatten and filter by confidence
      allPatterns.forEach(patternArray => {
        patterns.push(...patternArray);
      });

      return patterns.filter(pattern => pattern.confidence >= this.MIN_CONFIDENCE);
    } catch (error) {
      console.error('❌ Failed to detect UI patterns:', error);
      // Return empty array instead of throwing to allow extraction to continue
      return [];
    }
  }

  private async detectNavigationPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for sidebar navigation
    const sidebar = await page.$('[class*="sidebar"], nav[class*="side"]');
    if (sidebar) {
      const confidence = await this.calculateConfidence(sidebar, ['a', 'button'], 3);
      if (confidence >= this.MIN_CONFIDENCE) {
        patterns.push({
          type: 'navigation',
          variant: 'sidebar',
          confidence,
          selector: '[class*="sidebar"]',
          element: sidebar,
          properties: { layout: 'block' },
          accessibility: await this.checkAccessibility(sidebar),
          content: await this.extractContent(sidebar),
        });
      }
    }

    return patterns;
  }

  private async detectHeroPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for hero sections
    const heroSelectors = [
      '[class*="hero"]',
      '[class*="banner"]',
      'header[class*="hero"]',
      'section:first-of-type',
      '[class*="landing"]',
    ];

    for (const selector of heroSelectors) {
      const hero = await page.$(selector);
      if (hero) {
        const confidence = await this.calculateConfidence(
          hero,
          ['h1', 'h2', "[class*='title']"],
          1
        );

        if (confidence >= this.MIN_CONFIDENCE) {
          patterns.push({
            type: 'hero',
            variant: 'standard',
            confidence,
            selector,
            element: hero,
            properties: {
              layout: 'block',
              responsive: true,
            },
            accessibility: await this.checkAccessibility(hero),
            content: await this.extractContent(hero),
          });
          break; // Only take the first hero found
        }
      }
    }

    return patterns;
  }

  private async detectCardPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for card-like elements
    const cardSelectors = [
      '.card, [class*="card"]',
      'article',
      '[class*="product"]',
      '[class*="item"]',
    ];

    for (const selector of cardSelectors) {
      const cards = await page.$$(selector);
      if (cards.length >= 3) {
        // Need at least 3 cards for a pattern
        const firstCard = cards[0];
        if (!firstCard) continue; // Skip if firstCard is undefined

        const confidence = await this.calculateConfidence(firstCard, ['h3', 'h4', 'img', 'a'], 1);

        if (confidence >= this.MIN_CONFIDENCE) {
          patterns.push({
            type: 'cards',
            variant: 'grid',
            confidence,
            selector,
            element: firstCard,
            properties: {
              layout: 'grid',
              columns: Math.min(cards.length, 4),
              responsive: true,
            },
            accessibility: await this.checkAccessibility(firstCard),
            content: await this.extractContent(firstCard),
          });
          break;
        }
      }
    }

    return patterns;
  }

  private async detectFormPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for forms
    const forms = await page.$$('form, [class*="form"], [class*="contact"]');
    for (const form of forms) {
      const confidence = await this.calculateConfidence(
        form,
        ['input', 'textarea', 'select', 'button'],
        2
      );

      if (confidence >= this.MIN_CONFIDENCE) {
        patterns.push({
          type: 'form',
          variant: 'standard',
          confidence,
          selector: 'form',
          element: form,
          properties: {
            layout: 'block',
            responsive: true,
          },
          accessibility: await this.checkAccessibility(form),
          content: await this.extractContent(form),
        });
        break;
      }
    }

    return patterns;
  }

  private async detectTablePatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for tables
    const tables = await page.$$('table, [class*="table"], [role="table"]');
    for (const table of tables) {
      const confidence = await this.calculateConfidence(table, ['th', 'td', 'tr'], 3);

      if (confidence >= this.MIN_CONFIDENCE) {
        patterns.push({
          type: 'table',
          variant: 'data',
          confidence,
          selector: 'table',
          element: table,
          properties: {
            layout: 'block',
            responsive: true,
          },
          accessibility: await this.checkAccessibility(table),
          content: await this.extractContent(table),
        });
        break;
      }
    }

    return patterns;
  }

  private async detectPricingPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for pricing sections
    const pricingSelectors = [
      '[class*="pricing"]',
      '[class*="price"]',
      '[class*="plan"]',
      '[class*="subscription"]',
    ];

    for (const selector of pricingSelectors) {
      const pricing = await page.$(selector);
      if (pricing) {
        const confidence = await this.calculateConfidence(
          pricing,
          ["[class*='price']", "[class*='plan']", 'button'],
          2
        );

        if (confidence >= this.MIN_CONFIDENCE) {
          patterns.push({
            type: 'pricing',
            variant: 'cards',
            confidence,
            selector,
            element: pricing,
            properties: {
              layout: 'grid',
              columns: 3,
              responsive: true,
            },
            accessibility: await this.checkAccessibility(pricing),
            content: await this.extractContent(pricing),
          });
          break;
        }
      }
    }

    return patterns;
  }

  private async detectFooterPatterns(page: Page): Promise<UIPattern[]> {
    const patterns: UIPattern[] = [];

    // Check for footer
    const footerSelectors = [
      'footer',
      '[class*="footer"]',
      'div[class*="bottom"]',
      'section:last-of-type',
    ];

    for (const selector of footerSelectors) {
      const footer = await page.$(selector);
      if (footer) {
        const confidence = await this.calculateConfidence(footer, ['a', 'p', 'div'], 3);

        if (confidence >= this.MIN_CONFIDENCE) {
          patterns.push({
            type: 'footer',
            variant: 'standard',
            confidence,
            selector,
            element: footer,
            properties: {
              layout: 'block',
              responsive: true,
            },
            accessibility: await this.checkAccessibility(footer),
            content: await this.extractContent(footer),
          });
          break;
        }
      }
    }

    return patterns;
  }

  private async calculateConfidence(
    element: ElementHandle,
    selectors: string[],
    minCount: number
  ): Promise<number> {
    const count = await element.$$eval(selectors.join(', '), els => els.length);
    return Math.min(count / minCount, 1);
  }

  private async checkAccessibility(element: ElementHandle): Promise<UIPattern['accessibility']> {
    return await element.evaluate((el: Element) => ({
      hasAriaLabels: Array.from(el.querySelectorAll('[aria-label], [aria-labelledby]')).length > 0,
      hasRoles: Array.from(el.querySelectorAll('[role]')).length > 0,
      keyboardNavigable: Array.from(el.querySelectorAll('a, button, input, [tabindex]')).length > 0,
      semanticHTML: el.tagName === 'NAV' || Array.from(el.querySelectorAll('nav')).length > 0,
    }));
  }

  private async extractContent(element: ElementHandle): Promise<UIPattern['content']> {
    return await element.evaluate((el: Element) => ({
      headings: Array.from(el.querySelectorAll('h1, h2, h3'))
        .map((h: Element) => h.textContent?.trim())
        .filter(Boolean) as string[],
      text: el.textContent?.trim() || '',
      links: Array.from(el.querySelectorAll('a'))
        .map((a: Element) => a.textContent?.trim())
        .filter(Boolean) as string[],
      images: Array.from(el.querySelectorAll('img')).map((img: Element) => {
        const imgElement = img as HTMLImageElement;
        return imgElement.alt || imgElement.src || '';
      }),
    }));
  }
}
