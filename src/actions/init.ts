import chalk from "chalk";
import { clear } from "console";
import errorMessages from "../utils/errorMessages.js";
import fsUtils from "../utils/fsUtils.js";
import { matchTagged } from "../utils/unionUtils.js";

export default function init(): void {
  clear();

  console.log(`Running "tw-designer init"...`);

  // make sure the command is being run from the project root.
  const runningFromProjectRoot = fsUtils.runningFromProjectRoot();
  if (!runningFromProjectRoot) {
    return console.log(errorMessages.root);
  }

  const result = fsUtils.mkTwdDirIfNotExists();
  if (result === "created") {
    console.log(chalk.green(`✅ Created the ${fsUtils.twdDirName} directory.`));
  }

  const configFailed =
    matchTagged(fsUtils.makeDefaultConfig()).on<boolean | void>({
      err: (e) => {
        console.log(configError(e.message));
        return true;
      },
      ok: () =>
        console.log(chalk.green(`✅ Created ${fsUtils.fileNames.config}.`)),
    }) ?? false;
  if (configFailed) return;

  // check if the directory path exists
}

const configError = errorMessages.makeErrorMessageWithInner(
  "Error while creating the defaultConfigFile."
);
