#!/usr/bin/env node

import { Command } from "commander";
import add from "./actions/add.js";
import gen from "./actions/gen.js";
import init from "./actions/init.js";
import remove from "./actions/remove.js";

const program = new Command();

program
  .name("tw-designer")
  .description(
    `A CLI tool to help extend TailwindCSS with user-defined themes.
    
      - allows the user to construct multiple themes for TailwindCSS with Typescript using a set
      of type-safe primitives generated by this tool.`
  )
  .version("0.0.1");

program.command("init").description("Initializes tw-designer").action(init);

program
  .command("add")
  .description("add a new TailwindCSS property to be themed.")
  .action(add);

program
  .command("remove")
  .description(
    "remove a TailwindCSS property from the set of themeable properties."
  )
  .action(remove);

program
  .command("gen")
  .option(
    "--watch, -w",
    "enables watch mode, i.e. regenerates when file changes are mode to the tw-designer/ directory."
  )
  .description(
    "generates the CSS and tailwind.config extension module based on the themes in the tw-designer/themes/ directory."
  )
  .action(gen);

program.parse();
