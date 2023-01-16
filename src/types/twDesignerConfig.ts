import { ColorProperty } from "../tw-properties.js";

export type TwDesignerConfig = {
  colorProperties: ColorProperty[];
  classNames: Record<ColorProperty, string>;
};
