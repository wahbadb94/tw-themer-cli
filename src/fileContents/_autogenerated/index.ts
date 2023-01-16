const src = `
export {
  ExtendableTailwindProperties,
  ExtendableTailwindProperty,
  HexColor,
  PropertyAndStatesConfig,
  PropertyConfig,
  PropertyStateValues,
  StatesConfig,
  ThemeGenVariableConfig,
  ThemeableProperties,
  ThemeableProperty,
  Themed,
  propToTwMap,
  twToPropMap,
} from "./types";

export { serializeTheme } from "./serialize";
export { generateTwThemeExtensions } from "./gen";
`;

export default src;
