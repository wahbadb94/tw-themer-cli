import chalk from "chalk";
import fsUtils from "./fsUtils.js";

const root = `
${chalk.red(`❌ Error: Could not find a "package.json" file.`)}
  - Make sure you are running the command from the package root.
`;

const needsInit = `
${chalk.red(`❌ Error: Could not find the "${fsUtils.twdDirName}" directory.`)} 
  - Do you need to run ${chalk.blue(`tw-designer init`)} ?
`;

function makeErrorMessageWithInner(mainMsg: string) {
  return (innerMsg: string) => {
    return `
    ${chalk.red(`❌ ${mainMsg}`)}

    Inner Error:
      ${innerMsg}
    `;
  };
}

export default {
  root,
  needsInit,
  makeErrorMessageWithInner,
};
