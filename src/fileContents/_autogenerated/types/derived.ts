import { ProjectType } from "../../../types/projectType.js";
import fileExt from "../../../utils/fileExt.js";

const src = (type: ProjectType) => `
import { ExtendableTailwindProperty, ThemeableProperty } from "./properties${fileExt.getExt.ts(
  type
)}";

export type ThemeGenVariableConfig = {
  twType: ExtendableTailwindProperty;
  twName: string;
  cssVar: \`--color-\${string}\`;
  hexValue: HexColor;
};

export type HexColor = \`#\${string}\`;

export type Themed<
  Props extends ThemeableProperty,
  States extends string = "",
  Variants extends string = ""
> = "" extends Variants
  ? PropertyStateValues<Props, States>
  : PropertyStateValuesByVariant<Props, States, Variants>;

export type PropertyStateValuesByVariant<
  Props extends ThemeableProperty,
  States extends string = "",
  Variants extends string = ""
> = {
  [V in Variants]: PropertyStateValues<Props, States>;
} & {
  _hasVariants: true;
};

export type PropertyStateValues<
  Props extends ThemeableProperty,
  States extends string
> = "" extends States
  ? PropertyConfig<Props>
  : PropertyAndStatesConfig<Props, States>;

export type PropertyAndStatesConfig<
  Props extends ThemeableProperty,
  States extends string
> = PropertyConfig<Props> & {
  _states: StatesConfig<Props, States>;
};

export type StatesConfig<
  Props extends ThemeableProperty,
  States extends string
> = {
  [S in States]: PropertyConfig<Props>;
};

export type PropertyConfig<Props extends ThemeableProperty> = {
  [P in Props]: HexColor;
};
`;

export default src;
