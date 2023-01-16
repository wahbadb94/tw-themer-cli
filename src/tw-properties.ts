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

export type ColorProperty = typeof ColorProperties[number];

export function isColorProperty(prop: string): prop is ColorProperty {
  return (ColorProperties as readonly string[]).includes(prop);
}

export const DefaultClassNames = {
  accentColor: "accent",
  backgroundColor: "bg",
  borderColor: "border",
  boxShadowColor: "shadow",
  caretColor: "caret",
  fill: "fill",
  outlineColor: "outline",
  placeholderColor: "placeholder",
  ringColor: "ring",
  stroke: "stroke",
  textColor: "text",
  textDecorationColor: "textDecoration",
} as const satisfies Record<ColorProperty, string>;
