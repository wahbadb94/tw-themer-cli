import { clear } from "console";
import {
  ColorProperty,
  ColorProperties,
  DefaultClassNames,
} from "../types/tw-properties.js";
import inquirer from "inquirer";
import fsUtils from "../utils/fsUtils.js";
import errorMessages from "../utils/errorMessages.js";
import chalk from "chalk";
import { TwDesignerConfig } from "../types/twDesignerConfig.js";

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

  // load the existing config file
  const existingConfigResult = fsUtils.parseConfigFile();
  if (existingConfigResult.tag === "err") {
    return console.log(
      errorMessages.errorReadingConfig(existingConfigResult.message)
    );
  }

  const config = existingConfigResult.data;

  // let the user pick from properties not yet under our control
  const { propsToAdd } = (await inquirer.prompt({
    name: "propsToAdd",
    type: "checkbox",
    message: "Select properties to add",
    choices: ColorProperties.filter(
      (p) => !config.colorProperties.includes(p)
    ).sort(),
  })) as { propsToAdd: ColorProperty[] };

  // ask the user for a class name for each.
  const classNames = await propsToAdd.reduce(async (accPromise, prop) => {
    const acc = await accPromise;
    const { className } = (await inquirer.prompt({
      name: "className",
      type: "input",
      message: `Class name for "${prop}"`,
      default: DefaultClassNames[prop],
    })) as { className: string };

    acc[prop] = className;
    return acc;
  }, {} as Promise<Record<ColorProperty, string>>);

  const newConfigObject: TwDesignerConfig = {
    colorProperties: [...config.colorProperties, ...propsToAdd],
    classNames: {
      ...config.classNames,
      ...classNames,
    },
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

  console.log(chalk.green(`✅ Added: ${propsToAdd}`), "\n");
}
