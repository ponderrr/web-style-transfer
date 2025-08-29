# Web Style Transfer

A powerful system that extracts design tokens and brand content from any website, composes them into comprehensive specifications, and builds production-ready static site scaffolds.

## Overview

**Web Style Transfer** enables you to:

- **Extract** design systems, color palettes, typography, and layout patterns from any website
- **Compose** extracted elements into cohesive design specifications
- **Build** static site scaffolds with modern, accessible components
- **Validate** output against WCAG standards, performance budgets, and design principles

### Technologies

- **TypeScript** - Type-safe development with strict configuration
- **Playwright** - Browser automation for website analysis
- **JSON/YAML** - Flexible data schemas for design tokens
- **Schema Validation** - Zod-based validation for data integrity
- **Modern Web Stack** - Next.js, React, Tailwind CSS

### Architecture

The system operates through specialized agents:

- **Design Reviewer** - Analyzes visual hierarchy and design patterns
- **Accessibility Auditor** - Ensures WCAG compliance
- **Builder Orchestrator** - Generates component templates and site structure

## Repository Structure

```
web-style-transfer/
├── config/                 # Build and composition configuration
├── docs/                  # Documentation and workflow guides
│   ├── CLAUDE.md         # Agent system documentation
│   ├── design.md         # Design system principles
│   ├── patterns.md       # UI pattern library
│   └── workflows/        # Step-by-step guides
│       ├── extraction.md  # Style extraction workflow
│       ├── composition.md # Specification composition
│       └── building.md    # Site generation process
├── extractors/            # Playwright-based extraction scripts
│   ├── playwright/       # Browser automation utilities
│   │   ├── accessibility-checker.ts
│   │   ├── brand-extractor.ts
│   │   ├── pattern-detector.ts
│   │   ├── quality-scorer.ts
│   │   ├── style-extractor.ts
│   │   └── utils/        # Parsing and analysis utilities
│   └── schemas/          # Data validation schemas
├── scripts/               # CLI scripts for core operations
│   ├── extract-style.ts  # Style extraction
│   ├── extract-brand.ts  # Brand identity extraction
│   ├── compose-spec.ts   # Specification composition
│   ├── build-site.ts     # Site generation
│   └── validate-*.ts     # Various validation scripts
├── specs/                 # Generated specifications and tokens
│   ├── tokens/           # Design tokens (colors, typography, spacing)
│   ├── content/          # Site content structure
│   ├── patterns/         # UI and interaction patterns
│   └── composed/         # Final build specifications
├── src/                   # Source code and templates
│   ├── lib/              # Utility functions
│   └── templates/        # Component templates
├── validation/            # Rulesets and validation configs
│   ├── wcag-rules.json   # Accessibility standards
│   ├── performance-budget.json # Performance targets
│   └── design-lint-rules.json # Design system rules
└── tests/                 # Test files
```

## Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd web-style-transfer

# Install dependencies
npm install

# Verify installation
npm run check
```

## Usage

### Core Workflow

```bash
# 1. Extract style from a website
npm run extract:style -- --url https://example.com

# 2. Extract brand identity
npm run extract:brand -- --url https://example.com

# 3. Compose specifications
npm run compose

# 4. Build the website
npm run build:site

# 5. Validate output
npm run validate:all
```

### Quick Start

```bash
# Run the complete pipeline
npm run pipeline

# Or use the example workflow
npm run example:extract
npm run example:build
```

### Individual Commands

#### Extraction

```bash
# Extract design system
npm run extract:style -- --url https://example.com --output custom-output.json

# Extract brand identity
npm run extract:brand -- --url https://example.com --output brand-data.json
```

#### Composition

```bash
# Compose with default settings
npm run compose

# Compose using extracted data
npm run compose:extract
```

#### Building

```bash
# Build site from composed spec
npm run build:site

# Build individual components
npm run build:components
```

#### Validation

```bash
# Run all validations
npm run validate:all

# Individual validation types
npm run validate:design      # Design system validation
npm run validate:a11y        # Accessibility (WCAG)
npm run validate:performance # Performance metrics
npm run validate:tokens      # Design token validation
npm run validate:content     # Content structure
npm run validate:output      # Final output validation
```

### Development

```bash
# Type checking
npm run check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format

# Playwright tests
npm run test:playwright
```

## Configuration

### TypeScript

- **Module Resolution**: `"moduleResolution": "Bundler"`
- **ESM Support**: `"type": "module"` in package.json
- **Strict Mode**: All strict type checking enabled
- **Path Mappings**: Clean imports with `@/*` aliases

### Output Directories

- **Extracted Data**: `/extract` (gitignored)
- **Specifications**: `/specs/composed`
- **Reports**: `/reports` (gitignored)

## Development Guidelines

### Before Committing

```bash
# Always run these checks
npm run check          # TypeScript compilation
npm run lint           # ESLint validation
npm run format         # Prettier formatting
```

### Branch Naming

- **Features**: `feature/descriptive-name`
- **Fixes**: `fix/issue-description`
- **Documentation**: `docs/topic`

### Pull Request Process

1. Create feature branch from `main`
2. Make changes following the style guide
3. Run validation checks
4. Submit PR with clear description
5. Ensure CI passes before merging

### Generated Files

**Do NOT commit**:

- `/extract/` - Generated extraction outputs
- `/reports/` - Validation and analysis reports
- `/specs/tokens/`, `/specs/content/` - Intermediate specs

**DO commit**:

- `/specs/composed/` - Final build specifications
- Configuration files
- Source code and templates

## Documentation

- **[CLAUDE.md](docs/CLAUDE.md)** - Agent system and commands
- **[Design.md](docs/design.md)** - Design system principles
- **[Patterns.md](docs/patterns.md)** - UI pattern library
- **[Workflows](docs/workflows/)** - Step-by-step guides

## Testing

```bash
# Run Playwright tests
npm run test:playwright

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test extractors/playwright/style-extractor.spec.ts
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `npm run check` to identify issues
2. **Playwright Issues**: Clear cache with `npm run clean:cache`
3. **Build Failures**: Verify all dependencies with `npm install`

### Performance

- Use `--headless` flag for faster extraction
- Limit concurrent extractions to avoid rate limiting
- Clear browser cache between runs

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Install dependencies
npm install

# Set up Playwright browsers
npx playwright install

# Run validation
npm run validate:all
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/web-style-transfer/issues)
- **Documentation**: Check the `docs/` directory
- **Workflows**: See `docs/workflows/` for detailed guides

## Acknowledgments

Built with modern web technologies and best practices for design system extraction and website generation.
