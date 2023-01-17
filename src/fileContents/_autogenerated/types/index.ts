import { ProjectType } from "../../../types/projectType.js";
import fileExt from "../../../utils/fileExt.js";

const src = (type: ProjectType) => `
export {
  ExtendableTailwindProperties,
  ExtendableTailwindProperty,
  ThemeableProperties,
  ThemeableProperty,
  propToTwMap,
  twToPropMap,
} from "./properties${fileExt.getExt.ts(type)}";
export {
  HexColor,
  PropertyAndStatesConfig,
  PropertyConfig,
  PropertyStateValues,
  StatesConfig,
  ThemeGenVariableConfig,
  Themed,
} from "./derived${fileExt.getExt.ts(type)}";
`;

export default src;
