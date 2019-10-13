const help = `
Mimi Markdown Paper v${require('./package.json').version}

usage: mmp <command> <name> [<args>]

These are common MMP commands used in various situations:

command: init | build | clean

  init           Create an empty MMP workspace
  args:
    --bib, -b    Create workspace with bibtex

  build          Build markdown file to pdf
  args:
    --tex, -t    Do not build pdf
    --html, -h   Build html instead of pdf

  clean          Clean up all files

name: name of the workspace, must be the same as .md file
`;

function entry() {
  var arg = process.argv.slice(2);
  switch (arg.shift()) {
    case "init" : require("./lib/init")(arg) ; break;
    case "build": require("./lib/build")(arg); break;
    case "clean": require("./lib/clean")(arg); break;
    default     : console.log(help)          ; break;
  }
}

module.exports = entry;
