import chalk from "chalk";
import { clear } from "console";
import path from "path";
import { RequiredDevDeps } from "../types/deps.js";
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

  const baseDir = fsUtils.getTwdDirPath();

  // build out the expected directory structure
  const baseDirResult = fsUtils.createDirIfNotExists(baseDir);
  if (baseDirResult.tag === "err") {
    return console.log(
      errorMessages.makeErrorMessageWithInner(
        `Error creating the ${fsUtils.dirNames.twdBase} directory.`
      )
    );
  }

  const genDirResult = fsUtils.createDirIfNotExists(
    path.join(baseDir, fsUtils.dirNames._autogenerated)
  );
  if (genDirResult.tag === "err") {
    return console.log(
      errorMessages.makeErrorMessageWithInner(
        `Error creating the ${fsUtils.dirNames._autogenerated} directory.`
      )
    );
  }

  const typeDirResult = fsUtils.createDirIfNotExists(
    path.join(baseDir, fsUtils.dirNames._autoGeneratedTypes)
  );
  if (typeDirResult.tag === "err") {
    return console.log(
      errorMessages.makeErrorMessageWithInner(
        `Error creating the ${fsUtils.dirNames._autoGeneratedTypes} directory.`
      )
    );
  }

  const themesDirResult = fsUtils.createDirIfNotExists(
    path.join(baseDir, fsUtils.dirNames.themes)
  );
  if (themesDirResult.tag === "err") {
    return console.log(
      errorMessages.makeErrorMessageWithInner(
        `Error creating the ${fsUtils.dirNames._autoGeneratedTypes} directory.`
      )
    );
  }

  // create the config file
  if (!fsUtils.configFileExists()) {
    const makeConfigResult = fsUtils.writeObjToJSONFile(
      path.join(fsUtils.getTwdDirPath(), fsUtils.fileNames.config),
      {
        colorProperties: [],
      }
    );

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

  // read the package.json and check for required devDependencies.
  const fileResult = fsUtils.readFile(path.join("package.json"), "utf8");
  if (fileResult.tag === "err") {
    return console.log(fileResult.message);
  }

  const { devDependencies } = JSON.parse(fileResult.data) as {
    devDependencies?: Record<string, string>;
  };
  const searchObj = { ...devDependencies };
  const needsToInstall = RequiredDevDeps.filter(
    (d) => !Object.keys(searchObj).includes(d)
  );

  // let the user know they are ready to begin using the tool.
  console.log(readyMsg(needsToInstall));
}

const configError = errorMessages.makeErrorMessageWithInner(
  "Error while creating the defaultConfigFile."
);

const readyMsg = (needsToInstall: string[]) => `
${
  needsToInstall.length === 0
    ? ""
    : errorMessages.requiredDepsHelp(needsToInstall)
}
${
  needsToInstall.length === 0
    ? chalk.green(chalk.green("Everything looks good! 🎉"))
    : "Then:"
}
  - run ${chalk.blue("tw-designer add")} to begin themeing tailwind properties.
`;
