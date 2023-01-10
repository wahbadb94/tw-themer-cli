import path from "path";
import {
  existsSync,
  lstatSync,
  readFileSync,
  PathOrFileDescriptor,
  PathLike,
} from "fs";
import fsUtils from "../utils/fsUtils.js";
import { Result, wrapThrowable } from "../types/result.js";

const twdDirName = "tw-designer";

function getTwdDirPath(): string {
  const cwd = process.cwd();
  const directoryPath = path.join(cwd, twdDirName);

  return directoryPath;
}

function fileExists(path: PathLike): boolean {
  return existsSync(path) && lstatSync(path).isFile();
}

function dirExists(path: PathLike): boolean {
  return existsSync(path) && lstatSync(path).isDirectory();
}

function twdDirExists(): boolean {
  const directoryPath = fsUtils.getTwdDirPath();

  return existsSync(directoryPath) && lstatSync(directoryPath).isDirectory();
}

function configFileExists(): boolean {
  return fileExists(path.join(getTwdDirPath(), fileNames.config));
}

function runningFromProjectRoot(): boolean {
  const pkgJsonPath = path.join(process.cwd(), "package.json");

  return existsSync(pkgJsonPath) && lstatSync(pkgJsonPath).isFile();
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
  runningFromProjectRoot,
  fileNames,
  readFile,
  fileExists,
  dirExists,
  configFileExists,
} as const;
