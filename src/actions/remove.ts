import { clear } from "console";
import { ColorProperty } from "../tw-properties.js";
import inquirer from "inquirer";
import fsUtils from "../utils/fsUtils.js";
import errorMessages from "../utils/errorMessages.js";
import query from "../utils/query.js";
import chalk from "chalk";

export default async function remove(): Promise<void> {
  clear();

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
      errorMessages.errorReadingConfig(colorPropsResult.message)
    );
  }

  const { data: existingProperties } = colorPropsResult;

  // let the user pick from properties not yet under our control
  const { propsToRemove } = (await inquirer.prompt({
    name: "propsToRemove",
    type: "checkbox",
    message: "Select properties to remove",
    choices: existingProperties,
  })) as { propsToRemove: ColorProperty[] };

  const setPropertiesResult = query.colorProperties.set(
    existingProperties.filter((p) => !propsToRemove.includes(p))
  );
  if (setPropertiesResult.tag === "err") {
    console.log(
      errorMessages.errorWhileWritingFile(setPropertiesResult.message)
    );
  }

  console.log(chalk.green(`✅ Removed: ${propsToRemove}`), "\n");
}
