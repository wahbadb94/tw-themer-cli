import { clear } from "console";
import { ColorProperty, ColorProperties } from "../tw-properties.js";
import inquirer from "inquirer";
import fsUtils from "../utils/fsUtils.js";
import errorMessages from "../utils/errorMessages.js";
import query from "../utils/query.js";
import chalk from "chalk";

export default async function add(): Promise<void> {
  // clear the screen
  clear();

  // announce the process being run
  console.log(`running ${chalk.blue("tw-designer add")}...`, "\n");

  // make sure the command is being run from the project root.
  const runningFromProjectRoot = fsUtils.runningFromProjectRoot();
  if (!runningFromProjectRoot) {
    return console.log(errorMessages.root);
  }

  // make sure tw-designer was initialized
  const needsInit = !fsUtils.twdDirExists();
  if (needsInit) {
    return console.log(errorMessages.needsInit);
  }

  // check which properties have already been put under our control
  const colorPropsResult = query.colorProperties.get();
  if (colorPropsResult.tag === "err") {
    return console.log(
      errorMessages.errorParseColorProperties(colorPropsResult.message)
    );
  }

  const { data: existingProperties } = colorPropsResult;

  // let the user pick from properties not yet under our control
  const { propsToAdd } = (await inquirer.prompt({
    name: "propsToAdd",
    type: "checkbox",
    message: "Select properties to add",
    choices: ColorProperties.filter(
      (p) => !existingProperties.includes(p)
    ).sort(),
  })) as { propsToAdd: ColorProperty[] };

  const setPropertiesResult = query.colorProperties.set([
    ...existingProperties,
    ...propsToAdd,
  ]);
  if (setPropertiesResult.tag === "err") {
    console.log(
      errorMessages.errorSettingColorProperties(setPropertiesResult.message)
    );
  }

  console.log(chalk.green(`✅ Added: ${propsToAdd}`), "\n");
}
