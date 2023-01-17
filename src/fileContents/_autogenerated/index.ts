import { ProjectType } from "../../types/projectType.js";
import fileExt from "../../utils/fileExt.js";

const src = (type: ProjectType) => `
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
} from "./types${fileExt.getExt.ts(type)}";

export { serializeTheme } from "./serialize${fileExt.getExt.ts(type)}";
export { generateTwThemeExtensions } from "./gen${fileExt.getExt.ts(type)}";
`;

export default src;
