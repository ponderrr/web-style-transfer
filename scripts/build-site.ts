#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from "fs/promises";
import * as path from "path";
import { UnifiedSpec } from "../extractors/schemas/spec.schema";

const program = new Command();

program
  .name("build-site")
  .description("Build a modern website from a unified specification")
  .version("1.0.0")
  .argument("<spec-path>", "Path to unified specification JSON file")
  .option(
    "-o, --output <path>",
    "Output directory for generated site",
    "./output/generated-site"
  )
  .option(
    "-f, --framework <framework>",
    "Target framework (nextjs, vite, astro)",
    "nextjs"
  )
  .option("-v, --verbose", "Enable verbose logging")
  .action(async (specPath: string, options: any) => {
    try {
      console.log(
        chalk.blue(`🏗️  Building website from specification: ${specPath}`)
      );

      // Validate spec file exists
      try {
        await fs.access(specPath);
      } catch {
        console.error(
          chalk.red(`❌ Specification file not found: ${specPath}`)
        );
        process.exit(1);
      }

      // Load specification
      const spec: UnifiedSpec = JSON.parse(
        await fs.readFile(specPath, "utf-8")
      );

      // Load CLAUDE.md instructions if available
      let claudeInstructions = "";
      try {
        claudeInstructions = await fs.readFile("docs/CLAUDE.md", "utf-8");
        console.log(chalk.gray("📖 Loaded CLAUDE.md instructions for enhanced site generation"));
      } catch {
        console.log(chalk.yellow("⚠️  CLAUDE.md not found - proceeding without AI guidance"));
      }

      // Create output directory
      await fs.mkdir(options.output, { recursive: true });

      // Build Next.js site
      await this.buildNextJsSite(spec, options, claudeInstructions);

      // Display results
      console.log("");
      console.log(chalk.green("🎉 Website build complete!"));
      console.log(chalk.gray(`📁 Generated site: ${options.output}`));
    } catch (error) {
      console.error(chalk.red("❌ Build failed:"), error);
      process.exit(1);
    }
  });

async function buildNextJsSite(spec: UnifiedSpec, options: any, claudeInstructions: string = ""): Promise<void> {
  const outputDir = options.output;

  console.log(chalk.gray("   📦 Creating Next.js project structure..."));

  // Create package.json
  const packageJson = {
    name: "generated-site",
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
    },
    dependencies: {
      next: "^14.0.0",
      react: "^18.0.0",
      "react-dom": "^18.0.0",
      tailwindcss: "^3.0.0",
    },
    // Add metadata from CLAUDE.md if available
    ...(claudeInstructions && {
      description: "Website generated with AI assistance from CLAUDE.md instructions",
      keywords: ["generated", "ai-assisted", "nextjs"],
    }),
  };

  await fs.writeFile(
    path.join(outputDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // Create basic Tailwind config
  const tailwindConfig = `
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}`;
  await fs.writeFile(
    path.join(outputDir, "tailwind.config.js"),
    tailwindConfig
  );

  // Create src/pages/index.js
  const pagesDir = path.join(outputDir, "src", "pages");
  await fs.mkdir(pagesDir, { recursive: true });

  const homePage = `
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          ${spec.brand?.profile?.name || "Welcome"}
        </h1>
        <p className="text-xl text-center text-gray-600">
          ${spec.brand?.profile?.tagline || "Welcome to our website"}
        </p>
      </main>
    </div>
  )
}`;
  await fs.writeFile(path.join(pagesDir, "index.js"), homePage);

  // Create _app.js
  const appPage = `
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp`;
  await fs.writeFile(path.join(pagesDir, "_app.js"), appPage);

  // Create global styles
  const stylesDir = path.join(outputDir, "src", "styles");
  await fs.mkdir(stylesDir, { recursive: true });

  const globalsCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}`;
  await fs.writeFile(path.join(stylesDir, "globals.css"), globalsCss);

  // Create README.md with CLAUDE instructions if available
  if (claudeInstructions) {
    const readmeContent = `# Generated Website

This website was generated using AI assistance with the following instructions:

${claudeInstructions}

## Generated Files

- Built with Next.js and Tailwind CSS
- Based on extracted design tokens and brand guidelines
- Responsive design optimized for all devices

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm start
\`\`\`
`;

    await fs.writeFile(path.join(outputDir, "README.md"), readmeContent);
    console.log(chalk.gray("   📖 Created README.md with CLAUDE.md integration"));
  }

  console.log(chalk.gray("   ✅ Next.js project created successfully"));
}

// Add help examples
program.addHelpText(
  "after",
  `
Examples:
  $ build-site specs/composed/build-spec.json
  $ build-site specs/composed/build-spec.json --framework nextjs --output ./my-site
  $ build-site specs/composed/build-spec.json --verbose
`
);

program.parse();
