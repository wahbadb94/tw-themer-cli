import chalk from "chalk";
import { clear } from "console";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { wrapThrowable } from "../types/result.js";
import errorMessages from "../utils/errorMessages.js";
import fsUtils from "../utils/fsUtils.js";
import { matchTagged } from "../utils/unionUtils.js";

export default function init(): void {
  clear();

  console.log(`running ${chalk.blue("tw-designer init")}...`);
  console.log();

  // make sure the command is being run from the project root.
  const runningFromProjectRoot = fsUtils.runningFromProjectRoot();
  if (!runningFromProjectRoot) {
    return console.log(errorMessages.root);
  }

  if (!fsUtils.twdDirExists()) {
    mkdirSync(fsUtils.getTwdDirPath());
    console.log(chalk.green(`✅ Created: ${fsUtils.twdDirName}/`), "\n");
  }

  if (!fsUtils.configFileExists()) {
    const defaultFile = JSON.stringify(
      {
        colorProperties: [],
      },
      null,
      4
    );

    const errMsg = `Error while creating ${fsUtils.fileNames.config}`;
    const makeConfigResult = wrapThrowable(() => {
      writeFileSync(
        path.join(fsUtils.getTwdDirPath(), fsUtils.fileNames.config),
        defaultFile,
        {
          encoding: "utf8",
        }
      );
    }, errMsg);

    const configFailed = matchTagged(makeConfigResult).on<boolean | void>({
      ok: () => {
        console.log(
          chalk.green(`✅ Created: ${fsUtils.fileNames.config}`),
          "\n"
        );
        return false;
      },
      err: (e) => {
        console.log(configError(e.message));
        return true;
      },
    });
    if (configFailed) return;
  }

  // let the user know they are ready to begin using the tool.
  console.log(readyMsg);
}

const configError = errorMessages.makeErrorMessageWithInner(
  "Error while creating the defaultConfigFile."
);

const readyMsg = `
${chalk.green("Everything looks good! 🎉")}

  - run ${chalk.blue("tw-designer add")} to begin themeing tailwind properties.
`;
