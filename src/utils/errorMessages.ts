import chalk from "chalk";
import fsUtils from "./fsUtils.js";

const root = `
${chalk.red(`❌ Error: Could not find a "package.json" file.`)}
  - Make sure you are running the command from the package root.
`;

const needsInit = `
${chalk.red(
  `❌ Error: Could not find the "${fsUtils.dirNames.twdBase}" directory.`
)} 
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

const errorReadingConfig = makeErrorMessageWithInner(
  "Error while parsing the current configuration file."
);

const errorWhileWritingFile = makeErrorMessageWithInner(
  "Error while updating the configuration file."
);

const requiredDepsHelp = (needsToInstall: string[]) => `
${chalk.yellow(
  `Missing devDependencies: ${chalk.red(needsToInstall.join(", "))}`
)}
  - run ${chalk.blue(`npm i -D ${needsToInstall.join(" ")}`)} to install.
`;

export default {
  root,
  needsInit,
  makeErrorMessageWithInner,
  errorWhileWritingFile,
  errorReadingConfig,
  requiredDepsHelp,
};
