#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from "fs/promises";
import * as path from "path";
import { UnifiedSpec } from "../extractors/schemas/spec.schema";

const program = new Command();

program
  .name("build-components")
  .description("Build reusable component library from design specifications")
  .version("1.0.0")
  .argument("<spec-path>", "Path to unified specification JSON file")
  .option(
    "-o, --output <path>",
    "Output directory for component library",
    "./components"
  )
  .option(
    "-f, --framework <framework>",
    "Target framework (react, vue, svelte)",
    "react"
  )
  .option("-t, --typescript", "Generate TypeScript components")
  .option(
    "-s, --styling <styling>",
    "Styling approach (css-modules, styled-components)",
    "css-modules"
  )
  .action(async (specPath: string, options: any) => {
    try {
      console.log(
        chalk.blue(
          `🏗️  Building component library from specification: ${specPath}`
        )
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

      // Create output directory
      await fs.mkdir(options.output, { recursive: true });

      // Generate components based on framework
      switch (options.framework) {
        case "react":
          await generateReactComponents(spec, options);
          break;
        case "vue":
          await generateVueComponents(spec, options);
          break;
        case "svelte":
          await generateSvelteComponents(spec, options);
          break;
        default:
          console.error(
            chalk.red(`❌ Unsupported framework: ${options.framework}`)
          );
          process.exit(1);
      }

      // Generate index file
      await generateIndexFile(spec, options);

      console.log("");
      console.log(chalk.green("🎉 Component library build complete!"));
      console.log(chalk.gray(`📁 Generated components: ${options.output}`));
      console.log(chalk.gray(`🎨 Framework: ${options.framework}`));
      console.log(
        chalk.gray(`📝 TypeScript: ${options.typescript ? "Yes" : "No"}`)
      );
    } catch (error) {
      console.error(chalk.red("❌ Component build failed:"), error);
      process.exit(1);
    }
  });

async function generateReactComponents(
  spec: UnifiedSpec,
  options: any
): Promise<void> {
  const outputDir = options.output;
  const useTypeScript = options.typescript;

  for (const [componentName, componentSpec] of Object.entries(
    spec.generation.components
  )) {
    const fileExtension = useTypeScript ? "tsx" : "jsx";
    const componentContent = generateReactComponent(
      componentName,
      componentSpec,
      useTypeScript
    );

    await fs.writeFile(
      path.join(outputDir, `${componentName}.${fileExtension}`),
      componentContent
    );

    console.log(
      chalk.gray(`   ✅ Generated ${componentName}.${fileExtension}`)
    );
  }
}

function generateReactComponent(
  componentName: string,
  componentSpec: any,
  useTypeScript: boolean
): string {
  const propTypes = generatePropTypes(
    componentName,
    componentSpec,
    useTypeScript
  );
  const componentLogic = generateComponentLogic(componentName, componentSpec);

  if (useTypeScript) {
    return `import React from 'react';

${propTypes}

export const ${componentName}: React.FC<${componentName}Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    ${componentLogic}
  );
};

export default ${componentName};
`;
  }

  return `import React from 'react';

export const ${componentName} = ({
  className,
  children,
  ...props
}) => {
  return (
    ${componentLogic}
  );
};

export default ${componentName};
`;
}

function generatePropTypes(
  componentName: string,
  componentSpec: any,
  useTypeScript: boolean
): string {
  if (!useTypeScript) return "";

  const requiredProps = componentSpec.props || {};
  const propDefinitions = Object.entries(requiredProps)
    .map(
      ([key, value]: [string, any]) => `  ${key}: ${getTypeScriptType(value)};`
    )
    .join("\n");

  return `interface ${componentName}Props {
${propDefinitions}
  className?: string;
  children?: React.ReactNode;
}`;
}

function getTypeScriptType(value: any): string {
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "any[]";
  return "any";
}

function generateComponentLogic(
  componentName: string,
  componentSpec: any
): string {
  // Generate basic component structure based on type
  switch (componentSpec.type) {
    case "atom":
      return `<div className={\`component ${componentName.toLowerCase()} \${className || ''}\`} {...props}>
  {children}
</div>`;

    case "molecule":
      return `<div className={\`molecule ${componentName.toLowerCase()} \${className || ''}\`} {...props}>
  <div className="molecule-content">
    {children}
  </div>
</div>`;

    case "organism":
      return `<section className={\`organism ${componentName.toLowerCase()} \${className || ''}\`} {...props}>
  <div className="organism-header">
    <h2>${componentName}</h2>
  </div>
  <div className="organism-content">
    {children}
  </div>
</section>`;

    default:
      return `<div className={\`component ${componentName.toLowerCase()} \${className || ''}\`} {...props}>
  {children}
</div>`;
  }
}

async function generateVueComponents(
  spec: UnifiedSpec,
  options: any
): Promise<void> {
  // Placeholder for Vue component generation
  console.log(
    chalk.yellow("   ⚠️  Vue component generation not yet implemented")
  );
}

async function generateSvelteComponents(
  spec: UnifiedSpec,
  options: any
): Promise<void> {
  // Placeholder for Svelte component generation
  console.log(
    chalk.yellow("   ⚠️  Svelte component generation not yet implemented")
  );
}

async function generateIndexFile(
  spec: UnifiedSpec,
  options: any
): Promise<void> {
  const outputDir = options.output;
  const useTypeScript = options.typescript;
  const fileExtension = useTypeScript ? "ts" : "js";

  const componentNames = Object.keys(spec.generation.components);
  const exports = componentNames
    .map((name) => `export { ${name} } from './${name}';`)
    .join("\n");

  const indexContent = `${exports}

export default {
${componentNames.map((name) => `  ${name}`).join(",\n")}
};
`;

  await fs.writeFile(
    path.join(outputDir, `index.${fileExtension}`),
    indexContent
  );
}

// Add help examples
program.addHelpText(
  "after",
  `
Examples:
  $ build-components specs/composed/build-spec.json
  $ build-components specs/composed/build-spec.json --framework vue --typescript
  $ build-components specs/composed/build-spec.json --output ./my-components --styling styled-components
`
);

program.parse();
