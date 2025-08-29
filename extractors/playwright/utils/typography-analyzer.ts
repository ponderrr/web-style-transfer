import { Page } from "playwright";
import {
  Typography,
  TypographyScale,
  FontFamily,
} from "../../schemas/style.schema";

export interface TypographyAnalysis {
  scale: TypographyScale;
  fonts: FontFamily[];
  hierarchy: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    body: string;
    small: string;
  };
  metrics: {
    lineHeights: Record<string, number>;
    letterSpacing: Record<string, string>;
    fontWeights: number[];
  };
  modularScale?: {
    ratio: number;
    baseSize: number;
  };
}

export class TypographyAnalyzer {
  private readonly MODULAR_SCALE_RATIOS = [
    1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618,
  ];
  private readonly MIN_FONT_SIZE = 14;
  private readonly MAX_FONT_FAMILIES = 3;

  async analyzeTypography(page: Page): Promise<TypographyAnalysis> {
    // Extract typography data from the page
    const typographyData = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      const typographyMap = new Map();

      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        const fontFamily = style.fontFamily;
        const fontWeight = parseFloat(style.fontWeight) || 400;
        const lineHeight = parseFloat(style.lineHeight) || 1.2;
        const letterSpacing = style.letterSpacing;

        if (fontSize && fontFamily && el.textContent?.trim()) {
          const key = `${fontFamily}-${fontSize}-${fontWeight}`;

          if (!typographyMap.has(key)) {
            typographyMap.set(key, {
              fontFamily,
              fontSize,
              fontWeight,
              lineHeight,
              letterSpacing,
              elements: [],
            });
          }

          typographyMap.get(key).elements.push({
            tagName: el.tagName,
            className: el.className,
            text: el.textContent?.trim().substring(0, 50),
          });
        }
      });

      return Array.from(typographyMap.values());
    });

    return this.processTypographyData(typographyData);
  }

  private processTypographyData(data: any[]): TypographyAnalysis {
    // Group by font families
    const fontFamilies = this.extractFontFamilies(data);

    // Detect size scale
    const sizeScale = this.detectSizeScale(data);

    // Create hierarchy mapping
    const hierarchy = this.createHierarchy(data);

    // Calculate metrics
    const metrics = this.calculateMetrics(data);

    // Detect modular scale
    const modularScale = this.detectModularScale(sizeScale);

    return {
      scale: this.createTypographyScale(sizeScale, fontFamilies),
      fonts: fontFamilies,
      hierarchy,
      metrics,
      modularScale,
    };
  }

  private extractFontFamilies(data: any[]): FontFamily[] {
    const fontMap = new Map<string, any>();

    data.forEach((item) => {
      const fonts = this.parseFontStack(item.fontFamily);

      fonts.forEach((font, index) => {
        if (!fontMap.has(font)) {
          fontMap.set(font, {
            name: font,
            stack: fonts,
            fallback: index > 0,
            usage: [],
          });
        }

        fontMap.get(font).usage.push({
          size: item.fontSize,
          weight: item.fontWeight,
          elements: item.elements.length,
        });
      });
    });

    // Convert to array and sort by usage
    const families = Array.from(fontMap.values())
      .sort((a, b) => {
        const aUsage = a.usage.reduce(
          (sum: number, u: any) => sum + u.elements,
          0
        );
        const bUsage = b.usage.reduce(
          (sum: number, u: any) => sum + u.elements,
          0
        );
        return bUsage - aUsage;
      })
      .slice(0, this.MAX_FONT_FAMILIES);

    return families.map((family) => ({
      name: family.name,
      stack: family.stack,
      fallback: family.fallback,
    }));
  }

  private parseFontStack(fontFamily: string): string[] {
    // Split font stack and clean up
    return fontFamily
      .split(",")
      .map((font) => font.trim().replace(/['"]/g, ""))
      .filter(
        (font) =>
          font &&
          font !== "serif" &&
          font !== "sans-serif" &&
          font !== "monospace"
      );
  }

  private detectSizeScale(data: any[]): number[] {
    const sizes = data
      .map((item) => item.fontSize)
      .filter((size) => size >= this.MIN_FONT_SIZE);

    // Remove duplicates and sort
    const uniqueSizes = [...new Set(sizes)].sort((a, b) => b - a);

    // Round to nearest pixel for consistency
    return uniqueSizes.map((size) => Math.round(size)).slice(0, 8); // Limit to 8 sizes
  }

  private createHierarchy(data: any[]): TypographyAnalysis["hierarchy"] {
    const hierarchy: any = {
      h1: "",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
      h6: "",
      body: "",
      small: "",
    };

    // Group by tag names
    const byTag = new Map();
    data.forEach((item) => {
      item.elements.forEach((el: any) => {
        const tag = el.tagName.toLowerCase();
        if (!byTag.has(tag)) {
          byTag.set(tag, []);
        }
        byTag.get(tag).push({
          ...item,
          element: el,
        });
      });
    });

    // Assign sizes to hierarchy levels
    const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
    const sizes = this.detectSizeScale(data).sort((a, b) => b - a);

    headingTags.forEach((tag, index) => {
      if (byTag.has(tag)) {
        const tagData = byTag.get(tag);
        const avgSize =
          tagData.reduce((sum: number, item: any) => sum + item.fontSize, 0) /
          tagData.length;
        hierarchy[tag] = `${Math.round(avgSize)}px`;
      } else if (sizes[index]) {
        hierarchy[tag] = `${sizes[index]}px`;
      }
    });

    // Assign body and small sizes
    const bodySizes = sizes.filter((size) => size <= 18);
    hierarchy.body = bodySizes.length > 0 ? `${bodySizes[0]}px` : "16px";
    hierarchy.small = bodySizes.length > 1 ? `${bodySizes[1]}px` : "14px";

    return hierarchy;
  }

  private calculateMetrics(data: any[]): TypographyAnalysis["metrics"] {
    const lineHeights: Record<string, number> = {};
    const letterSpacing: Record<string, string> = {};
    const fontWeights: number[] = [];

    data.forEach((item) => {
      const sizeKey = `${item.fontSize}px`;

      // Line heights
      if (!lineHeights[sizeKey]) {
        lineHeights[sizeKey] = item.lineHeight;
      }

      // Letter spacing
      if (item.letterSpacing && item.letterSpacing !== "normal") {
        letterSpacing[sizeKey] = item.letterSpacing;
      }

      // Font weights
      if (!fontWeights.includes(item.fontWeight)) {
        fontWeights.push(item.fontWeight);
      }
    });

    return {
      lineHeights,
      letterSpacing,
      fontWeights: fontWeights.sort((a, b) => a - b),
    };
  }

  private detectModularScale(
    sizes: number[]
  ): TypographyAnalysis["modularScale"] {
    if (sizes.length < 3) return undefined;

    // Try different ratios to find the best fit
    for (const ratio of this.MODULAR_SCALE_RATIOS) {
      if (sizes.length === 0) continue;
      const baseSize = sizes[sizes.length - 1]; // Smallest size as base
      const generated = this.generateScale(baseSize, ratio, sizes.length);

      const similarity = this.calculateScaleSimilarity(sizes, generated);
      if (similarity > 0.8) {
        return {
          ratio,
          baseSize,
        };
      }
    }

    return undefined;
  }

  private generateScale(
    baseSize: number,
    ratio: number,
    length: number
  ): number[] {
    const scale: number[] = [baseSize];

    for (let i = 1; i < length; i++) {
      scale.push(Math.round(scale[i - 1] * ratio));
    }

    return scale;
  }

  private calculateScaleSimilarity(
    actual: number[],
    generated: number[]
  ): number {
    if (actual.length !== generated.length) return 0;

    let totalDifference = 0;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] === undefined || generated[i] === undefined) continue;
      const difference = Math.abs(actual[i] - generated[i]);
      const maxValue = Math.max(actual[i], generated[i]);
      if (maxValue > 0) {
        totalDifference += difference / maxValue;
      }
    }

    return 1 - totalDifference / actual.length;
  }

  private createTypographyScale(
    sizes: number[],
    fonts: FontFamily[]
  ): TypographyScale {
    const scale: TypographyScale = {};
    const primaryFont = fonts[0]?.stack[0] || "system-ui";

    // Create scale entries
    const sizeNames = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];

    sizes
      .slice()
      .reverse()
      .forEach((size, index) => {
        const name = sizeNames[index] || `size-${index}`;
        scale[name] = {
          size: `${size}px`,
          lineHeight: this.calculateOptimalLineHeight(size),
          fontFamily: primaryFont,
          fontWeight: index >= 3 ? 700 : 400, // Larger sizes get bold weight
        };
      });

    return scale;
  }

  private calculateOptimalLineHeight(fontSize: number): number {
    // Based on typography best practices
    if (fontSize <= 14) return 1.5;
    if (fontSize <= 18) return 1.6;
    if (fontSize <= 24) return 1.4;
    if (fontSize <= 32) return 1.3;
    return 1.2;
  }
}
