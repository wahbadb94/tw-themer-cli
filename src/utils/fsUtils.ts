import path from "path";
import {
  existsSync,
  mkdirSync,
  lstatSync,
  writeFileSync,
  readFileSync,
  PathOrFileDescriptor,
} from "fs";
import fsUtils from "../utils/fsUtils.js";
import { Result, wrapThrowable } from "../types/result.js";

const twdDirName = "tw-designer";

function getTwdDirPath(): string {
  const cwd = process.cwd();
  const directoryPath = path.join(cwd, twdDirName);

  return directoryPath;
}

function twdDirExists(): boolean {
  const directoryPath = fsUtils.getTwdDirPath();

  return existsSync(directoryPath) && lstatSync(directoryPath).isDirectory();
}

function mkTwdDirIfNotExists(): "created" | "alreadyExists" {
  if (twdDirExists()) return "alreadyExists";

  mkdirSync(getTwdDirPath());
  return "created";
}

function runningFromProjectRoot(): boolean {
  const pkgJsonPath = path.join(process.cwd(), "package.json");

  return existsSync(pkgJsonPath) && lstatSync(pkgJsonPath).isFile();
}

function makeDefaultConfig(): Result<void> {
  const defaultFile = JSON.stringify({
    colorProperties: [],
  });

  const errMsg = ``;
  return wrapThrowable(() => {
    writeFileSync(path.join(getTwdDirPath(), fileNames.config), defaultFile, {
      encoding: "utf8",
    });
  }, errMsg);
}

function readFile(
  path: PathOrFileDescriptor,
  options: BufferEncoding
): Result<string> {
  const msg = `Could not load the file: ${fsUtils.fileNames.config}.`;

  return wrapThrowable(() => readFileSync(path, options), msg);
}

const fileNames = {
  config: "tw-designer.config.json",
} as const;

export default {
  getTwdDirPath,
  twdDirName,
  twdDirExists,
  mkTwdDirIfNotExists,
  runningFromProjectRoot,
  fileNames,
  readFile,
  makeDefaultConfig,
} as const;
