import {
  DesignTokens,
  ColorSystem,
  Typography,
  SpacingScale,
} from "../schemas/style.schema";

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

export class QualityScorer {
  private readonly WEIGHTS = {
    colorConsistency: 0.15,
    typographyHierarchy: 0.15,
    spacingRegularity: 0.15,
    accessibilityCompliance: 0.25,
    patternConsistency: 0.1,
    performanceOptimization: 0.1,
    modernityScore: 0.1,
  };

  private readonly S_TIER_THRESHOLDS = {
    excellent: 0.9,
    good: 0.8,
    acceptable: 0.7,
    needsImprovement: 0.6,
  };

  calculateScore(tokens: DesignTokens, patterns: any[]): QualityScore {
    const scores = {
      colorConsistency: this.scoreColorConsistency(tokens.color),
      typographyHierarchy: this.scoreTypographyHierarchy(tokens.typography),
      spacingRegularity: this.scoreSpacingRegularity(tokens.spacing),
      accessibilityCompliance: this.scoreAccessibilityCompliance(tokens),
      patternConsistency: this.scorePatternConsistency(patterns),
      performanceOptimization: this.scorePerformanceOptimization(tokens),
      modernityScore: this.scoreModernity(tokens),
    };

    const overall = this.calculateWeightedScore(scores);
    const recommendations = this.generateRecommendations(scores);

    return {
      overall,
      breakdown: scores,
      recommendations,
    };
  }

  private scoreColorConsistency(colors: ColorSystem): number {
    if (!colors) return 0;

    let score = 0.5; // Base score

    // Check for semantic color usage
    const hasSemanticColors =
      colors.primary && colors.secondary && colors.accent;
    if (hasSemanticColors) score += 0.2;

    // Check for consistent neutral scale
    const neutralColors = Object.keys(colors).filter(
      (key) =>
        key.includes("gray") ||
        key.includes("neutral") ||
        key.includes("50") ||
        key.includes("100")
    );
    if (neutralColors.length >= 5) score += 0.15;

    // Penalize for too many colors
    const totalColors = Object.keys(colors).length;
    if (totalColors > 15) score -= 0.1;
    else if (totalColors <= 10) score += 0.1;

    return Math.max(0, Math.min(1, score));
  }

  private scoreTypographyHierarchy(typography: Typography): number {
    if (!typography) return 0;

    let score = 0.5;

    // Check for modular scale
    const hasScale =
      typography.scale && Object.keys(typography.scale).length >= 3;
    if (hasScale) score += 0.2;

    // Check for font family consistency
    const fonts = typography.family;
    if (fonts && fonts.length <= 3) score += 0.15;

    // Check for proper size hierarchy
    const sizes = Object.values(typography.scale || {});
    const hasHierarchy = sizes.length > 1 && this.isProperHierarchy(sizes);
    if (hasHierarchy) score += 0.15;

    return Math.max(0, Math.min(1, score));
  }

  private scoreSpacingRegularity(spacing: SpacingScale): number {
    if (!spacing) return 0;

    let score = 0.5;

    // Check for consistent scale
    const values = Object.values(spacing);
    const isConsistent = this.isConsistentScale(values);
    if (isConsistent) score += 0.2;

    // Check for 8px base unit preference
    const has8pxBase = values.some((v) => typeof v === "number" && v % 8 === 0);
    if (has8pxBase) score += 0.15;

    // Check for reasonable number of values
    if (values.length >= 6 && values.length <= 12) score += 0.15;

    return Math.max(0, Math.min(1, score));
  }

  private scoreAccessibilityCompliance(tokens: DesignTokens): number {
    if (!tokens) return 0;

    let score = 0.5;

    // Check for sufficient color contrast (placeholder - would need actual contrast calculation)
    const hasGoodContrast = tokens.color?.primary && tokens.color?.background;
    if (hasGoodContrast) score += 0.2;

    // Check for readable font sizes
    const hasReadableSizes =
      tokens.typography?.scale?.body &&
      parseFloat(String(tokens.typography.scale.body.size || "16px")) >= 14;
    if (hasReadableSizes) score += 0.15;

    // Check for focus indicators (placeholder)
    const hasFocusTokens = tokens.color?.focus;
    if (hasFocusTokens) score += 0.15;

    return Math.max(0, Math.min(1, score));
  }

  private scorePatternConsistency(patterns: any[]): number {
    if (!patterns || patterns.length === 0) return 0.5;

    let score = 0.5;

    // Check for consistent pattern usage
    const patternTypes = new Set(patterns.map((p) => p.type));
    const hasVariety = patternTypes.size >= 3;
    if (hasVariety) score += 0.15;

    // Check for high-confidence patterns
    const highConfidencePatterns = patterns.filter((p) => p.confidence > 0.8);
    const hasHighConfidence = highConfidencePatterns.length > 0;
    if (hasHighConfidence) score += 0.2;

    // Check for semantic patterns
    const hasSemanticPatterns = patterns.some((p) =>
      ["navigation", "hero", "form"].includes(p.type)
    );
    if (hasSemanticPatterns) score += 0.15;

    return Math.max(0, Math.min(1, score));
  }

  private scorePerformanceOptimization(tokens: DesignTokens): number {
    let score = 0.5;

    // Check for optimized font loading
    const hasFontOptimization = tokens.typography?.loading === "optimized";
    if (hasFontOptimization) score += 0.15;

    // Check for minimal color palette
    const colorCount = tokens.color ? Object.keys(tokens.color).length : 0;
    if (colorCount <= 12) score += 0.15;

    // Check for efficient spacing system
    const spacingCount = tokens.spacing
      ? Object.keys(tokens.spacing).length
      : 0;
    if (spacingCount <= 10) score += 0.2;

    return Math.max(0, Math.min(1, score));
  }

  private scoreModernity(tokens: DesignTokens): number {
    let score = 0.5;

    // Check for modern design tokens
    const hasModernTokens = tokens.borderRadius || tokens.shadow;
    if (hasModernTokens) score += 0.15;

    // Check for CSS Grid/Flexbox support
    const hasLayoutTokens = tokens.grid || tokens.flex;
    if (hasLayoutTokens) score += 0.15;

    // Check for dark mode support
    const hasDarkMode = tokens.color?.dark || tokens.color?.onDark;
    if (hasDarkMode) score += 0.2;

    return Math.max(0, Math.min(1, score));
  }

  private calculateWeightedScore(scores: QualityScore["breakdown"]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [key, score] of Object.entries(scores)) {
      const weight = this.WEIGHTS[key as keyof typeof this.WEIGHTS];
      weightedSum += score * weight;
      totalWeight += weight;
    }

    return weightedSum / totalWeight;
  }

  private generateRecommendations(scores: QualityScore["breakdown"]): string[] {
    const recommendations: string[] = [];

    if (scores.colorConsistency < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Establish a more consistent color system with semantic color tokens"
      );
    }

    if (scores.typographyHierarchy < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Improve typography hierarchy with a clear modular scale"
      );
    }

    if (scores.spacingRegularity < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Implement a more consistent spacing scale (preferably 8px-based)"
      );
    }

    if (scores.accessibilityCompliance < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Improve accessibility compliance - ensure proper contrast ratios and focus indicators"
      );
    }

    if (scores.patternConsistency < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Standardize UI patterns and ensure consistent component usage"
      );
    }

    if (scores.performanceOptimization < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Optimize for performance - reduce color palette and spacing scale complexity"
      );
    }

    if (scores.modernityScore < this.S_TIER_THRESHOLDS.acceptable) {
      recommendations.push(
        "Modernize design tokens - add border radius, shadows, and layout tokens"
      );
    }

    return recommendations;
  }

  private isProperHierarchy(sizes: any[]): boolean {
    if (sizes.length < 2) return false;

    const numericSizes = sizes
      .map((s) => (typeof s === "string" ? parseFloat(s) : s))
      .filter((n) => !isNaN(n));
    if (numericSizes.length < 2) return false;

    // Check if sizes are in reasonable order (larger to smaller or vice versa)
    const sorted = [...numericSizes].sort((a, b) => b - a);
    const isDescending = numericSizes.every(
      (size, index) => size === sorted[index]
    );

    const reverseSorted = [...numericSizes].sort((a, b) => a - b);
    const isAscending = numericSizes.every(
      (size, index) => size === reverseSorted[index]
    );

    return isDescending || isAscending;
  }

  private isConsistentScale(values: any[]): boolean {
    if (values.length < 3) return true;

    const numericValues = values
      .map((v) => (typeof v === "string" ? parseFloat(v) : v))
      .filter((n) => !isNaN(n));
    if (numericValues.length < 3) return false;

    // Check if values follow a consistent pattern (arithmetic or geometric progression)
    const diffs = [];
    for (let i = 1; i < numericValues.length; i++) {
      diffs.push(numericValues[i] - numericValues[i - 1]);
    }

    // Check if differences are similar (arithmetic progression)
    const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
    const isArithmetic = diffs.every(
      (diff) => Math.abs(diff - avgDiff) < avgDiff * 0.5
    );

    // Check for geometric progression (ratios)
    const ratios = [];
    for (let i = 1; i < numericValues.length; i++) {
      if (numericValues[i - 1] !== 0) {
        ratios.push(numericValues[i] / numericValues[i - 1]);
      }
    }

    if (ratios.length > 0) {
      const avgRatio =
        ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
      const isGeometric = ratios.every(
        (ratio) => Math.abs(ratio - avgRatio) < avgRatio * 0.2
      );
      if (isGeometric) return true;
    }

    return isArithmetic;
  }
}
