export const ColorProperties = [
  "borderColor",
  "backgroundColor",
  "fill",
  "stroke",
  "textColor",
  "textDecorationColor",
  "placeholderColor",
  "caretColor",
  "accentColor",
  "boxShadowColor",
  "outlineColor",
  "ringColor",
] as const;

export type ColorProperty = (typeof ColorProperties)[number];

export function isColorProperty(prop: string): prop is ColorProperty {
  return (ColorProperties as readonly string[]).includes(prop);
}
