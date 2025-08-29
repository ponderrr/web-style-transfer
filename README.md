# Web Style Transfer

S-Tier website extraction and regeneration system that analyzes websites, extracts their design systems, and generates high-quality, production-ready websites.

## Features

- **Website Analysis**: Extract design systems, color palettes, typography, and layout patterns
- **Brand Extraction**: Identify brand identity elements including logos, colors, and visual style
- **Style Transfer**: Apply extracted styles to new content and generate websites
- **Accessibility Validation**: Ensure generated websites meet WCAG standards
- **Performance Optimization**: Generate performant, optimized websites
- **Multi-Source Transfer**: Combine styles from multiple websites for unique designs

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web-style-transfer

# Install dependencies
npm install

# Run the full pipeline
npm run pipeline
```

## Usage

### Core Commands

```bash
# Extract style from a website
npm run extract:style

# Extract brand identity
npm run extract:brand

# Compose specifications
npm run compose

# Build the website
npm run build:site

# Run all validations
npm run validate:all
```

### Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Style Transfer

```bash
# Single source transfer
npm run transfer

# Multi-source transfer
npm run transfer:multi
```

## Project Structure

```
├── config/                 # Configuration files
├── extractors/            # Website analysis and extraction
│   ├── playwright/       # Browser automation
│   └── schemas/          # Data schemas
├── scripts/               # CLI scripts
├── specs/                # Generated specifications
├── src/                  # Source code
│   ├── lib/             # Utility libraries
│   └── templates/       # Component templates
├── tests/                # Test files
└── validation/           # Validation rules and configs
```

## Configuration

### TypeScript Configuration

The project uses strict TypeScript with comprehensive path mappings:

- `strict: true` - All strict type checking enabled
- Path mappings for clean imports (`@/components/*`, `@/lib/*`, etc.)
- Source maps and declaration files enabled

### ESLint Configuration

Extends Next.js core web vitals with TypeScript support:

- TypeScript recommended rules
- React hooks rules
- Prettier integration
- Custom rules for code quality

### Prettier Configuration

- 2 space indentation
- Single quotes
- Semicolons required
- 100 character line width

## API Reference

### Extraction Scripts

#### `extract-style.ts`

Extracts comprehensive style information from websites including:

- Color palettes and themes
- Typography systems
- Spacing and layout patterns
- Component styles

#### `extract-brand.ts`

Identifies brand identity elements:

- Logo detection and extraction
- Brand color identification
- Visual style analysis

#### `compose-spec.ts`

Combines extracted data into cohesive design specifications.

### Validation Scripts

#### `validate-design.ts`

Design system validation against best practices.

#### `validate-accessibility.ts`

WCAG compliance checking using axe-playwright.

#### `validate-performance.ts`

Performance metrics validation using Lighthouse.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and validation
5. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

## Testing

```bash
# Run Playwright tests
npm run test:playwright

# Run with UI
npx playwright test --ui
```

## Configuration Files

- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `playwright.config.ts` - Playwright test configuration
- `package.json` - Project dependencies and scripts

## License

MIT License - see LICENSE file for details.

## Support

For questions and support:

- Open an issue on GitHub
- Check the documentation in the `docs/` directory
- Review the workflow guides in `docs/workflows/`
