import path from "path";
import { ColorProperty } from "../tw-properties.js";
import { result, Result } from "../types/result.js";
import { TwDesignerConfig } from "../types/twDesignerConfig.js";
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
      return result.ok(obj.colorProperties ?? []);
    },
  });
}

function colorPropertiesSet(colorProperties: ColorProperty[]): Result<void> {
  const configResult = fsUtils.parseConfigFile();

  if (configResult.tag === "err") {
    return configResult;
  }

  const { data: config } = configResult;
  const newConfig: TwDesignerConfig = {
    ...config,
    colorProperties,
  };

  return fsUtils.writeConfigFile(newConfig);
}

export default {
  colorProperties: {
    get: colorPropertiesGet,
    set: colorPropertiesSet,
  },
};
