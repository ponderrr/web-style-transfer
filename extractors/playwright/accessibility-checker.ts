import { Page } from 'playwright';

export interface WCAGViolation {
  rule: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  element: string;
  guideline: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

export interface AccessibilityReport {
  score: number; // 0-100
  violations: WCAGViolation[];
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  recommendations: string[];
}

export class AccessibilityChecker {
  async checkWCAG(page: Page): Promise<AccessibilityReport> {
    const violations: WCAGViolation[] = [];

    // Check color contrast
    const colorIssues = await this.checkColorContrast();
    violations.push(...colorIssues);

    // Check images without alt text
    const altIssues = await this.checkMissingAltText(page);
    violations.push(...altIssues);

    const score = this.calculateScore(violations);
    const summary = this.summarizeViolations(violations);
    const recommendations = this.generateRecommendations(violations);

    return {
      score,
      violations,
      summary,
      recommendations,
    };
  }

  private async checkColorContrast(): Promise<WCAGViolation[]> {
    const violations: WCAGViolation[] = [];

    // Simple check for very low contrast (would need more sophisticated analysis)
    // For now, return empty array - would need color analysis
    // TODO: Implement actual color contrast analysis
    return violations;
  }

  private async checkMissingAltText(page: Page): Promise<WCAGViolation[]> {
    const violations: WCAGViolation[] = [];

    const imagesWithoutAlt = await page.$$eval('img:not([alt]), img[alt=""]', images => {
      return images.map(img => ({
        src: img.getAttribute('src'),
        tagName: img.tagName,
      }));
    });

    for (const img of imagesWithoutAlt) {
      violations.push({
        rule: 'image-alt',
        impact: 'serious',
        description: 'Image missing alt text',
        element: `img[src="${img.src}"]`,
        guideline: '1.1.1 Non-text Content',
        wcagLevel: 'A',
      });
    }

    return violations;
  }

  private calculateScore(violations: WCAGViolation[]): number {
    if (violations.length === 0) return 100;

    const penalty = violations.length * 5; // 5 points per violation
    return Math.max(0, 100 - penalty);
  }

  private summarizeViolations(violations: WCAGViolation[]): AccessibilityReport['summary'] {
    return violations.reduce(
      (summary, violation) => {
        summary[violation.impact]++;
        return summary;
      },
      { critical: 0, serious: 0, moderate: 0, minor: 0 }
    );
  }

  private generateRecommendations(violations: WCAGViolation[]): string[] {
    const recommendations: string[] = [];
    const violationTypes = new Set(violations.map(v => v.rule));

    if (violationTypes.has('image-alt')) {
      recommendations.push('Add descriptive alt text to all images');
    }

    return recommendations;
  }
}
