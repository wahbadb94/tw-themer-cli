import path from "path";
import {
  existsSync,
  lstatSync,
  readFileSync,
  PathOrFileDescriptor,
  PathLike,
  writeFileSync,
} from "fs";
import fsUtils from "../utils/fsUtils.js";
import { result, Result, wrapThrowable } from "../types/result.js";
import { matchTagged } from "./unionUtils.js";
import { TwDesignerConfig } from "../types/twDesignerConfig.js";

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

function writeObjToJSONFile<T extends Record<string, unknown>>(
  path: PathLike,
  obj: T
): Result<void> {
  const fileContents = JSON.stringify(obj, null, 4);

  return wrapThrowable(() => {
    writeFileSync(path, fileContents, "utf8");
  }, `Something went wrong while writing to "${path.toString()}"`);
}

function parseConfigFile(): Result<TwDesignerConfig> {
  const fileResult = readFile(
    path.join(getTwdDirPath(), fileNames.config),
    "utf8"
  );

  return matchTagged(fileResult).on<Result<TwDesignerConfig>>({
    err: (e) => e,
    ok: ({ data }) => {
      return result.ok(JSON.parse(data) as TwDesignerConfig);
    },
  });
}

function writeConfigFile(newConfig: TwDesignerConfig): Result<void> {
  return writeObjToJSONFile(getConfigPath(), newConfig);
}

function getConfigPath(): string {
  return path.join(getTwdDirPath(), fileNames.config);
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
  writeObjToJSONFile,
  parseConfigFile,
  writeConfigFile,
} as const;
