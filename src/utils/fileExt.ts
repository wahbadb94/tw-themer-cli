import { ProjectType } from "../types/projectType.js";

export default {
  getExt: {
    commonjs(type: ProjectType) {
      return type === "module" ? ".cjs" : ".js";
    },
    ts(type: ProjectType) {
      // the .js extension is needed when running node in a directory
      // with type === "module" in the package.json
      return type === "module" ? ".js" : "";
    },
  },
};
