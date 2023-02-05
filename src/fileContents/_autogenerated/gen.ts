import { ProjectType } from "../../types/projectType.js";
import fileExt from "../../utils/fileExt.js";

const src = (type: ProjectType) => `
import * as fs from "fs";
import { ThemeDefinition } from "../themeDefinition${fileExt.getExt.ts(type)}";
import { serializeTheme } from "./serialize${fileExt.getExt.ts(type)}";
import { ExtendableTailwindProperties } from "./types/properties${fileExt.getExt.ts(
  type
)}";

export function generateTwThemeExtensions(
  theme: ThemeDefinition,
  cssPath: string,
  tailwindThemeExtensionPath: string
) {
  // generate the css file content
  const cssFileContent = genCss(theme);

  // generate the tailwind extension file content
  const tailwindThemeExtensionContent = genTailwindExtension(theme);

  // write the css file if it differs
  const existingCssFile = fileExists(cssPath);
  const oldCssContents = existingCssFile
    ? fs.readFileSync(cssPath, { encoding: "utf8" })
    : "";

  if (cssFileContent !== oldCssContents) {
    if (existingCssFile) {
      console.log("regenerated css file.");
    }

    fs.writeFile(cssPath, cssFileContent, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // write the tailwindExtension cjs file if it differs
  const existingExtensionFile = fileExists(tailwindThemeExtensionPath);
  const oldThemeExtensionContents = existingExtensionFile
    ? fs.readFileSync(tailwindThemeExtensionPath, { encoding: "utf8" })
    : "";

  if (tailwindThemeExtensionContent !== oldThemeExtensionContents) {
    if (existingExtensionFile) {
      console.log("regenerated tw-designer extension file.");
    }

    fs.writeFile(
      tailwindThemeExtensionPath,
      tailwindThemeExtensionContent,
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }
}

function fileExists(path: fs.PathLike): boolean {
  return fs.existsSync(path) && fs.lstatSync(path).isFile();
}

function genCss(theme: ThemeDefinition): string {
  // generate a list of css variables from the theme object
  const cssGenConfigs = serializeTheme(theme);

  return \`
  /* NOTE: This file was auto-generated. DO NOT MODIFY. */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    :root {
      \${cssGenConfigs
        .map((v) => \`\${v.cssVar}: \${v.hexValue};\`)
        .join("\\n      ")}
    }
  }
\`;
}

function genTailwindExtension(theme: ThemeDefinition): string {
  // generate a list of css variables from the theme object
  const cssGenConfigs = serializeTheme(theme);

  // generate the taiilwind extension file
  return \`
    /* NOTE: This file was auto-generated. DO NOT MODIFY. */
    module.exports = {
      extend: { \${ExtendableTailwindProperties.reduce((acc, prop) => {
        const str = \`
            \${prop}: {
              skin: {
                \${cssGenConfigs
                  .filter((c) => c.twType === prop)
                  .map((c) => \`"\${c.twName}": "var(\${c.cssVar})",\`)
                  .join("\\n\\t\\t\\t\\t\\t\\t\\t")}
              },
            },\`;

        return acc + str;
      }, "")}
        },
      }
    \`;
}
`;

export default src;
