const src = `
import { ThemeDefinition } from "../themeDefinition";
import { propToTwMap, ThemeableProperty } from "./types/properties";
import {
  PropertyAndStatesConfig,
  PropertyStateValues,
  StatesConfig,
  ThemeGenVariableConfig,
} from "./types/derived";

/** */
export function serializeTheme(
  theme: ThemeDefinition
): ThemeGenVariableConfig[] {
  const variables = [] as ThemeGenVariableConfig[];

  for (const component in theme) {
    const componentConfig = theme[component as keyof typeof theme];

    // check if it has variants
    if ("_hasVariants" in componentConfig) {
      // iterate over variants
      Object.keys(componentConfig)
        .filter((k) => k !== "_hasVariants")
        .map((k) => k as Exclude<keyof typeof componentConfig, "_hasVariants">)
        .forEach((variant) => {
          const variantConfigs = serializeComponent({
            // @ts-ignore
            twName: \`\${component}-\${variant}\`,
            // @ts-ignore
            propStateVals: componentConfig[variant],
          });

          variables.push(...variantConfigs);
        });
    } else {
      // otherwise serialize like normal
      const variableConfigs = serializeComponent({
        twName: component,
        propStateVals: componentConfig as any,
      });
      variables.push(...variableConfigs);
    }
  }

  return variables;
}

type SerializeComponentParams<P extends ThemeableProperty, S extends string> = {
  /** */
  propStateVals: PropertyStateValues<P, S>;
  /** */
  twName: string;
};

function serializeComponent<P extends ThemeableProperty, S extends string>({
  propStateVals,
  twName,
}: SerializeComponentParams<P, S>): ThemeGenVariableConfig[] {
  const variables = [] as ThemeGenVariableConfig[];

  Object.keys(propStateVals)
    .map((k) => k as keyof typeof propStateVals)
    .forEach((propOrStates) => {
      if (hasStateConfig(propStateVals) && propOrStates === "_states") {
        const statesConfig = propStateVals["_states"] as StatesConfig<P, S>;
        Object.keys(statesConfig)
          .map((k) => k as keyof typeof statesConfig)
          .forEach((state) => {
            const statesRules = serializeComponent({
              twName: \`\${twName}--\${state}\`,
              propStateVals: statesConfig[state] as PropertyStateValues<
                P,
                typeof state
              >,
            });

            variables.push(...statesRules);
          });
      } else {
        // otherwise we have a regular config so generate a rule
        const prop = propOrStates as ThemeableProperty;
        variables.push({
          twType: propToTwMap[prop],
          cssVar: \`--color-\${twName}-\${prop}\`,
          hexValue: propStateVals[propOrStates],
          twName,
        });
      }
    });

  return variables;
}

function hasStateConfig<P extends ThemeableProperty, S extends string>(
  psv: PropertyStateValues<P, S>
): psv is PropertyAndStatesConfig<P, S> {
  return "_states" in psv;
}

/** */
export default {
  serializeTheme,
};

`;

export default src;
