import { Command } from "commander";
import add from "./actions/add.js";
import init from "./actions/init.js";
import remove from "./actions/remove.js";

const program = new Command();

program
  .name("tw-designer")
  .description(
    "A CLI tool to help extend TailwindCSS with a user-defined design system."
  )
  .version("1.0.0");

program.command("init").description("Initializes tw-designer").action(init);

program
  .command("add")
  .description("add a new TailwindCSS property to your design system")
  .action(add);

program
  .command("remove")
  .description("remove a TailwindCSS property from your design system")
  .action(remove);

program.parse();
