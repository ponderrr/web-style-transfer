import { Page } from "playwright";
import { SpacingScale, SpacingSystem } from "../../schemas/style.schema";

export interface SpacingAnalysis {
  scale: SpacingScale;
  system: SpacingSystem;
  grid: {
    columns?: number;
    gutter?: string;
    container?: string;
    breakpoints?: Record<string, string>;
  };
  detectedValues: number[];
  recommendedBase: number;
}

export class SpacingDetector {
  private readonly COMMON_BASE_UNITS = [4, 8, 12, 16];
  private readonly MAX_SCALE_SIZE = 16;

  async detectSpacingSystem(page: Page): Promise<SpacingAnalysis> {
    // Extract all spacing-related CSS values from the page
    const spacingData = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      const spacingValues = new Set<number>();

      elements.forEach((el) => {
        const style = window.getComputedStyle(el);

        // Extract margin and padding values
        const properties = [
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left",
          "padding-top",
          "padding-right",
          "padding-bottom",
          "padding-left",
          "gap",
          "row-gap",
          "column-gap",
          "top",
          "right",
          "bottom",
          "left",
        ];

        properties.forEach((prop) => {
          const value = style.getPropertyValue(prop);
          const numericValue = this.extractNumericValue(value);
          if (numericValue > 0 && numericValue <= 200) {
            // Reasonable spacing range
            spacingValues.add(numericValue);
          }
        });
      });

      return Array.from(spacingValues).sort((a, b) => a - b);
    });

    return this.analyzeSpacingData(spacingData);
  }

  private extractNumericValue(cssValue: string): number {
    if (!cssValue || cssValue === "auto" || cssValue === "none") return 0;

    const match = cssValue.match(/(\d+(\.\d+)?)px/);
    return match && match[1] ? parseFloat(match[1]) : 0;
  }

  private analyzeSpacingData(values: number[]): SpacingAnalysis {
    // Determine the best base unit
    const recommendedBase = this.determineBaseUnit(values);

    // Generate spacing scale
    const scale = this.generateSpacingScale(recommendedBase);

    // Create spacing system
    const system = this.createSpacingSystem(values, recommendedBase);

    // Detect grid system
    const grid = this.detectGridSystem(values);

    return {
      scale,
      system,
      grid,
      detectedValues: values,
      recommendedBase,
    };
  }

  private determineBaseUnit(values: number[]): number {
    if (values.length === 0) return 8; // Default to 8px

    // Score each possible base unit
    const scores = this.COMMON_BASE_UNITS.map((base) => ({
      base,
      score: this.scoreBaseUnit(base, values),
    }));

    // Return the highest scoring base unit
    scores.sort((a, b) => b.score - a.score);
    return scores.length > 0 ? scores[0].base : 8; // Default to 8px if no scores
  }

  private scoreBaseUnit(base: number, values: number[]): number {
    let score = 0;
    let perfectMatches = 0;

    for (const value of values) {
      // Check if value is a multiple of base
      if (value % base === 0) {
        score += 2;
        perfectMatches++;
      }
      // Check if value is close to a multiple of base (within 1px)
      else {
        const multiple = Math.round(value / base) * base;
        const difference = Math.abs(value - multiple);
        if (difference <= 1) {
          score += 1;
        }
      }
    }

    // Bonus for having many perfect matches
    if (perfectMatches > values.length * 0.7) {
      score += 5;
    }

    return score;
  }

  private generateSpacingScale(baseUnit: number): SpacingScale {
    const scale: SpacingScale = {};

    // Generate scale from 1x to 16x base unit
    for (let i = 1; i <= this.MAX_SCALE_SIZE; i++) {
      const value = i * baseUnit;
      scale[i] = `${value}px`;
    }

    // Add common fractional values
    scale["0.5"] = `${baseUnit / 2}px`;
    scale["1.5"] = `${baseUnit * 1.5}px`;
    scale["2.5"] = `${baseUnit * 2.5}px`;
    scale["3.5"] = `${baseUnit * 3.5}px`;

    return scale;
  }

  private createSpacingSystem(
    values: number[],
    baseUnit: number
  ): SpacingSystem {
    // Group values by their relationship to base unit
    const grouped = this.groupValuesByBase(values, baseUnit);

    return {
      base: `${baseUnit}px`,
      scale: this.generateSpacingScale(baseUnit),
      usage: grouped,
      recommendations: this.generateSpacingRecommendations(values, baseUnit),
    };
  }

  private groupValuesByBase(
    values: number[],
    base: number
  ): Record<string, number[]> {
    const grouped: Record<string, number[]> = {
      perfect: [],
      close: [],
      other: [],
    };

    values.forEach((value) => {
      if (value % base === 0) {
        grouped.perfect!.push(value);
      } else if (Math.abs(value - Math.round(value / base) * base) <= 1) {
        grouped.close!.push(value);
      } else {
        grouped.other!.push(value);
      }
    });

    return grouped;
  }

  private detectGridSystem(values: number[]): SpacingAnalysis["grid"] {
    const grid: SpacingAnalysis["grid"] = {};

    // Look for common grid values
    const sortedValues = [...values].sort((a, b) => a - b);

    // Detect potential gutter values (smaller, repeating values)
    const potentialGutters = sortedValues.filter((v) => v <= 32 && v >= 8);
    if (potentialGutters.length > 0) {
      // Find the most common gutter value
      const gutterCounts = potentialGutters.reduce(
        (acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>
      );

      const mostCommonGutter = Object.entries(gutterCounts).sort(
        ([, a], [, b]) => b - a
      )[0];

      if (mostCommonGutter) {
        grid.gutter = `${mostCommonGutter[0]}px`;
      }
    }

    // Detect container widths (larger values, likely to be max-widths)
    const potentialContainers = sortedValues.filter(
      (v) => v >= 600 && v <= 1600
    );
    if (potentialContainers.length > 0) {
      // Use the largest as container width
      grid.container = `${Math.max(...potentialContainers)}px`;
    }

    // Common breakpoints detection
    const commonBreakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    };

    const detectedBreakpoints: Record<string, string> = {};
    Object.entries(commonBreakpoints).forEach(([name, width]) => {
      // Check if any detected value is close to this breakpoint
      const closeValue = values.find((v) => Math.abs(v - width) <= 20);
      if (closeValue) {
        detectedBreakpoints[name] = `${closeValue}px`;
      }
    });

    if (Object.keys(detectedBreakpoints).length > 0) {
      grid.breakpoints = detectedBreakpoints;
    }

    // Estimate column count based on spacing patterns
    const estimatedColumns = this.estimateColumnCount(values);
    if (estimatedColumns) {
      grid.columns = estimatedColumns;
    }

    return grid;
  }

  private estimateColumnCount(values: number[]): number | undefined {
    // Look for patterns that suggest grid layouts
    const sortedValues = [...values].sort((a, b) => a - b);

    // Check for common grid patterns (2, 3, 4, 6, 12 columns)
    const commonGrids = [2, 3, 4, 6, 12];

    for (const columns of commonGrids) {
      const columnSpacing = sortedValues.find((v) => {
        // Look for spacing that could accommodate this many columns
        return v >= columns * 100 && v <= columns * 300; // Rough estimate
      });

      if (columnSpacing) {
        return columns;
      }
    }

    return undefined;
  }

  private generateSpacingRecommendations(
    values: number[],
    baseUnit: number
  ): string[] {
    const recommendations: string[] = [];

    if (values.length > 20) {
      recommendations.push(
        "Consider consolidating your spacing scale - you have many different spacing values"
      );
    }

    const perfectMatches = values.filter((v) => v % baseUnit === 0).length;
    const perfectPercentage = (perfectMatches / values.length) * 100;

    if (perfectPercentage < 50) {
      recommendations.push(
        `Only ${perfectPercentage.toFixed(0)}% of spacing values align with ${baseUnit}px base unit. Consider standardizing.`
      );
    }

    if (baseUnit !== 8) {
      recommendations.push(
        "Consider using 8px as base unit for better consistency with design systems"
      );
    }

    const largeSpacing = values.filter((v) => v > 100).length;
    if (largeSpacing > values.length * 0.3) {
      recommendations.push(
        "Many large spacing values detected - consider if all are necessary"
      );
    }

    return recommendations;
  }
}
