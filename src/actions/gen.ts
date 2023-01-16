import childProcess from "child_process";
import path from "path";
import errorMessages from "../utils/errorMessages.js";
import fsUtils from "../utils/fsUtils.js";

export default function (): void {
  console.log("call to the generated generation script goes here.");

  // read the package.json file and check if we are in a cjs or esm context.
  const pjsonResult = fsUtils.readPackageJSON();
  if (pjsonResult.tag === "err") {
    return console.log(
      errorMessages.makeErrorMessageWithInner(
        "Error while reading the package.json file."
      )
    );
  }

  // get the correct esm module extension from the package context
  const {
    data: { type = "commonjs" },
  } = pjsonResult;

  const genScriptPath = path.join(
    fsUtils.getTwdDirPath(),
    fsUtils.fileNames.genScript(type)
  );

  runScript(genScriptPath, (err) => {
    if (err) throw err;

    console.log(`finished running: ${genScriptPath}`);
  });
}

function runScript(scriptPath: string, callback: (err: Error | null) => void) {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  const process = childProcess.fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on("error", function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on("exit", function (code) {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error("exit code " + code);
    callback(err);
  });
}
