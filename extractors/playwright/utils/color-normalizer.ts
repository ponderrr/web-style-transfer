import { ColorSystem, ColorToken } from '../../schemas/style.schema';

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorGroup {
  colors: string[];
  averageColor: string;
  semanticRole?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
}

export interface NormalizedColorSystem {
  tokens: Record<string, ColorToken>;
  palette: ColorGroup[];
  semantic: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  darkMode?: ColorSystem;
}

export class ColorNormalizer {
  private readonly SIMILARITY_THRESHOLD = 5; // HSL difference threshold
  private readonly MAX_COLORS = 12;
  private readonly NEUTRAL_SCALE_STEPS = 11; // 50-950 scale

  normalizeColors(colors: string[]): NormalizedColorSystem {
    // Convert all colors to HSL
    const hslColors = colors.map(color => ({
      original: color,
      hsl: this.hexToHsl(color) || this.rgbToHsl(color) || this.namedToHsl(color)
    })).filter(c => c.hsl) as Array<{ original: string; hsl: HSLColor }>;

    // Group similar colors
    const groups = this.groupSimilarColors(hslColors);

    // Identify semantic roles
    const semanticGroups = this.identifySemanticRoles(groups);

    // Generate neutral scale
    const neutralScale = this.generateNeutralScale(semanticGroups);

    // Create tokens
    const tokens = this.createColorTokens(semanticGroups, neutralScale);

    // Generate semantic color assignments
    const semantic = this.assignSemanticColors(semanticGroups);

    return {
      tokens,
      palette: groups,
      semantic,
      darkMode: this.generateDarkModePalette(tokens)
    };
  }

  private hexToHsl(hex: string): HSLColor | null {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Handle 3-digit hex
    const fullHex = cleanHex.length === 3 ?
      cleanHex.split('').map(c => c + c).join('') : cleanHex;

    if (fullHex.length !== 6) return null;

    const r = parseInt(fullHex.substr(0, 2), 16) / 255;
    const g = parseInt(fullHex.substr(2, 2), 16) / 255;
    const b = parseInt(fullHex.substr(4, 2), 16) / 255;

    return this.rgbToHslValues(r, g, b);
  }

  private rgbToHsl(rgb: string): HSLColor | null {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match || !match[1] || !match[2] || !match[3]) return null;

    const r = parseInt(match[1], 10) / 255;
    const g = parseInt(match[2], 10) / 255;
    const b = parseInt(match[3], 10) / 255;

    return this.rgbToHslValues(r, g, b);
  }

  private namedToHsl(name: string): HSLColor | null {
    // Simple named color mapping - would need comprehensive color name database
    const namedColors: Record<string, string> = {
      'white': '#FFFFFF',
      'black': '#000000',
      'red': '#FF0000',
      'green': '#008000',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'orange': '#FFA500'
    };

    const hex = namedColors[name.toLowerCase()];
    return hex ? this.hexToHsl(hex) : null;
  }

  private rgbToHslValues(r: number, g: number, b: number): HSLColor {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  private groupSimilarColors(colors: Array<{ original: string; hsl: HSLColor }>): ColorGroup[] {
    const groups: ColorGroup[] = [];

    for (const color of colors) {
      let addedToGroup = false;

      for (const group of groups) {
        const representativeColor = group.colors[0];
        const representativeHsl = colors.find(c => c.original === representativeColor)?.hsl;

        if (representativeHsl && this.areColorsSimilar(color.hsl, representativeHsl)) {
          group.colors.push(color.original);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push({
          colors: [color.original],
          averageColor: color.original
        });
      }
    }

    // Limit to maximum colors
    const sortedGroups = groups
      .sort((a, b) => b.colors.length - a.colors.length)
      .slice(0, this.MAX_COLORS);

    return sortedGroups;
  }

  private areColorsSimilar(hsl1: HSLColor, hsl2: HSLColor): boolean {
    const hDiff = Math.min(Math.abs(hsl1.h - hsl2.h), 360 - Math.abs(hsl1.h - hsl2.h));
    const sDiff = Math.abs(hsl1.s - hsl2.s);
    const lDiff = Math.abs(hsl1.l - hsl2.l);

    return hDiff <= this.SIMILARITY_THRESHOLD &&
           sDiff <= this.SIMILARITY_THRESHOLD &&
           lDiff <= this.SIMILARITY_THRESHOLD;
  }

  private identifySemanticRoles(groups: ColorGroup[]): ColorGroup[] {
    // Sort by saturation and lightness to identify potential roles
    return groups.map(group => {
      if (!group.colors || group.colors.length === 0) return group;

      const hsl = this.hexToHsl(group.colors[0]);
      if (!hsl) return group;

      // High saturation, medium lightness = primary/accent
      if (hsl.s > 60 && hsl.l > 30 && hsl.l < 70) {
        group.semanticRole = hsl.h < 30 || hsl.h > 330 ? 'primary' :
                           hsl.h > 90 && hsl.h < 150 ? 'success' :
                           hsl.h > 30 && hsl.h < 90 ? 'warning' : 'accent';
      }
      // Low saturation, various lightness = neutral
      else if (hsl.s < 20) {
        group.semanticRole = 'neutral';
      }
      // High saturation, low lightness = secondary
      else if (hsl.s > 40 && hsl.l < 30) {
        group.semanticRole = 'secondary';
      }
      // Medium saturation, high lightness = neutral
      else if (hsl.l > 70) {
        group.semanticRole = 'neutral';
      }

      return group;
    });
  }

  private generateNeutralScale(groups: ColorGroup[]): string[] {
    // Find neutral colors or generate from grays
    const neutralGroups = groups.filter(g => g.semanticRole === 'neutral');

    if (neutralGroups.length > 0 && neutralGroups[0].colors && neutralGroups[0].colors.length > 0) {
      // Use existing neutrals to generate scale
      const baseNeutral = neutralGroups[0].colors[0];
      return this.generateNeutralVariants(baseNeutral);
    }

    // Generate default neutral scale
    return this.generateDefaultNeutrals();
  }

  private generateNeutralVariants(baseColor: string): string[] {
    const hsl = this.hexToHsl(baseColor);
    if (!hsl) return this.generateDefaultNeutrals();

    const variants: string[] = [];

    // Generate 11-step scale (50-950)
    for (let i = 0; i < this.NEUTRAL_SCALE_STEPS; i++) {
      const lightness = 95 - (i * 9); // 95% to 5% lightness
      const variantHsl: HSLColor = {
        h: hsl.h,
        s: Math.max(5, hsl.s * 0.3), // Reduce saturation
        l: lightness
      };

      const rgb = this.hslToRgb(variantHsl);
      variants.push(this.rgbToHex(rgb.r, rgb.g, rgb.b));
    }

    return variants;
  }

  private generateDefaultNeutrals(): string[] {
    const variants: string[] = [];

    for (let i = 0; i < this.NEUTRAL_SCALE_STEPS; i++) {
      const lightness = 95 - (i * 9);
      const hsl: HSLColor = { h: 0, s: 0, l: lightness };
      const rgb = this.hslToRgb(hsl);
      variants.push(this.rgbToHex(rgb.r, rgb.g, rgb.b));
    }

    return variants;
  }

  private hslToRgb(hsl: HSLColor): { r: number; g: number; b: number } {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  private createColorTokens(groups: ColorGroup[], neutralScale: string[]): Record<string, ColorToken> {
    const tokens: Record<string, ColorToken> = {};

    // Add semantic colors
    groups.forEach((group, index) => {
      if (group.semanticRole && group.semanticRole !== 'neutral' && group.colors && group.colors.length > 0) {
        tokens[group.semanticRole] = {
          $value: group.colors[0],
          $type: 'color'
        };
      }
    });

    // Add neutral scale
    neutralScale.forEach((color, index) => {
      const step = (index + 1) * 100; // 100, 200, 300, ..., 1100
      tokens[`neutral-${step}`] = {
        $value: color,
        $type: 'color'
      };
    });

    // Add background and text colors
    if (neutralScale.length > 0) {
      tokens["background"] = { $value: neutralScale[0], $type: 'color' };
    }
    if (neutralScale.length > 1) {
      tokens['background-secondary'] = { $value: neutralScale[1], $type: 'color' };
    }
    if (neutralScale.length > 0) {
      tokens["text"] = { $value: neutralScale[neutralScale.length - 1], $type: 'color' };
    }
    if (neutralScale.length > 1) {
      tokens['text-secondary'] = { $value: neutralScale[neutralScale.length - 2], $type: 'color' };
    }

    return tokens;
  }

  private assignSemanticColors(groups: ColorGroup[]): NormalizedColorSystem['semantic'] {
    const primaryGroup = groups.find(g => g.semanticRole === 'primary');
    const secondaryGroup = groups.find(g => g.semanticRole === 'secondary');
    const accentGroup = groups.find(g => g.semanticRole === 'accent');
    const neutralGroups = groups.filter(g => g.semanticRole === 'neutral');

    return {
      primary: primaryGroup?.colors[0] || '#3B82F6',
      secondary: secondaryGroup?.colors[0] || '#6B7280',
      accent: accentGroup?.colors[0] || '#10B981',
      neutral: neutralGroups
        .filter(g => g.colors && g.colors.length > 0)
        .map(g => g.colors[0]),
      semantic: {
        success: groups.find(g => g.semanticRole === 'success')?.colors[0] || '#10B981',
        warning: groups.find(g => g.semanticRole === 'warning')?.colors[0] || '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      }
    };
  }

  private generateDarkModePalette(lightTokens: Record<string, ColorToken>): ColorSystem {
    const darkTokens: Record<string, ColorToken> = {};

    for (const [key, token] of Object.entries(lightTokens)) {
      if (token.$type === 'color') {
        darkTokens[key] = {
          $value: this.generateDarkVariant(token.$value),
          $type: 'color'
        };
      }
    }

    return darkTokens;
  }

  private generateDarkVariant(color: string): string {
    const hsl = this.hexToHsl(color);
    if (!hsl) return color;

    // Increase lightness for dark mode
    const darkHsl: HSLColor = {
      h: hsl.h,
      s: hsl.s,
      l: Math.min(95, hsl.l + 20)
    };

    const rgb = this.hslToRgb(darkHsl);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }
}