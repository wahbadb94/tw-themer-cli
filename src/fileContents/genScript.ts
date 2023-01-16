const src = `
import { generateTwThemeExtensions } from "./_autogenerated/gen";
import defaultTheme from "./themes/default";

generateTwThemeExtensions(
  defaultTheme,
  "./src/_variables.css",
  "./tailwindThemeExtension.cjs"
);
`;

export default src;