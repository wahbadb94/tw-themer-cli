import childProcess from "child_process";
import path from "path";
import errorMessages from "../utils/errorMessages.js";
import fsUtils from "../utils/fsUtils.js";
import { clear } from "console";
import chalk from "chalk";
import { ProjectType } from "../types/projectType.js";

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
  const pjsonResult = fsUtils.readPackageJSON();
  if (pjsonResult.tag === "err") {
    return console.log(pjsonResult.message);
  }
  const { devDependencies, type = "commonjs" } = pjsonResult.data;

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

  runScript(genScriptPath, type);
}

function runScript(scriptPath: string, type: ProjectType) {
  childProcess.exec(
    `npx ${tsNodeCommand(type)} ${scriptPath}`,
    (error, stdout, stderr) => {
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
    }
  );
}

const tsNodeCommand = (type: ProjectType) =>
  type === "module" ? "ts-node --esm" : "ts-node";
