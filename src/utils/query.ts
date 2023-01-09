import path from "path";
import { ColorProperty } from "../tw-properties.js";
import { ok, Result } from "../types/result.js";
import fsUtils from "./fsUtils.js";
import { matchTagged } from "./unionUtils.js";

function colorPropertiesGet(): Result<ColorProperty[]> {
  // read the config file
  const fileResult = fsUtils.readFile(
    path.join(fsUtils.getTwdDirPath(), fsUtils.fileNames.config),
    "utf8"
  );

  // either pass up the error, or parse the JSON file
  return matchTagged(fileResult).on<Result<ColorProperty[]>>({
    err: (e) => e,
    ok: ({ data }) => {
      const obj = JSON.parse(data);
      return ok(obj.colorProperties ?? []);
    },
  });
}

function colorPropertiesSet(): void {
  console.log("setting color properties...");
}

export default {
  colorProperties: {
    get: colorPropertiesGet,
    set: colorPropertiesSet,
  },
};
