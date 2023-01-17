import { clear } from "console";
import { ColorProperty } from "../tw-properties.js";
import inquirer from "inquirer";
import fsUtils from "../utils/fsUtils.js";
import errorMessages from "../utils/errorMessages.js";
import chalk from "chalk";
import { TwDesignerConfig } from "../types/twDesignerConfig.js";

export default async function remove(): Promise<void> {
  clear();

  console.log(`running ${chalk.blue("tw-designer remove")}...`, "\n");

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
  const existingConfigResult = fsUtils.parseConfigFile();
  if (existingConfigResult.tag === "err") {
    return console.log(
      errorMessages.errorReadingConfig(existingConfigResult.message)
    );
  }

  const {
    colorProperties: existingProperties,
    classNames: existingClassNames,
  } = existingConfigResult.data;

  // let the user pick from properties not yet under our control
  const { propsToRemove } = (await inquirer.prompt({
    name: "propsToRemove",
    type: "checkbox",
    message: "Select properties to remove",
    choices: existingProperties,
  })) as { propsToRemove: ColorProperty[] };

  // calculate the new config
  const newProperties = existingProperties.filter(
    (p) => !propsToRemove.includes(p)
  );
  const newConfigObject: TwDesignerConfig = {
    colorProperties: newProperties,
    classNames: newProperties.reduce(
      (acc, prop) => ({
        ...acc,
        [prop]: existingClassNames[prop],
      }),
      {} as Record<ColorProperty, string>
    ),
  };

  const updateConfigResult = fsUtils.writeConfigFile(newConfigObject);
  if (updateConfigResult.tag === "err") {
    return console.log(
      errorMessages.errorWhileWritingFile(updateConfigResult.message)
    );
  }

  const updateTsFileResult = fsUtils.writeTsFiles(newConfigObject);
  if (updateTsFileResult.tag === "err") {
    return console.log(
      errorMessages.errorWhileWritingFile(updateTsFileResult.message)
    );
  }

  console.log(chalk.green(`✅ Removed: ${propsToRemove}`), "\n");
}
