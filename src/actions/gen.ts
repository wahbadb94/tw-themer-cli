import childProcess from "child_process";
import path from "path";
import errorMessages from "../utils/errorMessages.js";
import fsUtils from "../utils/fsUtils.js";
import { clear } from "console";
import chalk from "chalk";

export default function (): void {
  clear();

  console.log(`running ${chalk.blue("tw-designer gen")}...`);
  console.log();

  // make sure the command is being run from the project root.
  const runningFromProjectRoot = fsUtils.runningFromProjectRoot();
  if (!runningFromProjectRoot) {
    return console.log(errorMessages.root);
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
  const requiredDevDeps = ["typescript", "ts-node", "@types/node"];
  const needsToInstall = requiredDevDeps.filter(
    (d) => !Object.keys(searchObj).includes(d)
  );

  if (needsToInstall.length > 0) {
    return console.log(errorMessages.requiredDepsHelp(needsToInstall));
  }

  // gen the genScript.ts path and run
  const genScriptPath = path.join(
    fsUtils.getTwdDirPath(),
    fsUtils.fileNames.genScript
  );

  runScript(genScriptPath);
}

function runScript(scriptPath: string) {
  childProcess.exec(`npx ts-node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      return console.log(
        errorMessages.makeErrorMessageWithInner(
          `Error while running ${scriptPath}.`
        )(`Error: ${error.message}`)
      );
    }
    if (stderr) {
      return console.log(
        errorMessages.makeErrorMessageWithInner(
          `Error while running ${scriptPath}.`
        )(`From stderr: ${stderr}`)
      );
    }

    if (stdout) {
      console.log(stdout);
    }
  });
}
