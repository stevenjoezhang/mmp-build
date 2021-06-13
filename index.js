import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, './package.json')));

const help = `
Mimi Markdown Paper v${version}

usage: mmp <command> <name> [<args>]

These are common MMP commands used in various situations:

command: init | build | clean

  init           Create an empty MMP workspace
  args:
    -b, --bib    Create workspace with bibtex

  build          Build markdown file to pdf
  args:
    -q, --quiet  Reduce terminal output from XeLaTeX
    -t, --tex    Do not build pdf
    -h, --html   Build html instead of pdf

  clean          Clean up all files

name: name of the workspace, must be the same as .md file
`;

export default async function() {
  const arg = process.argv.slice(2);
  switch (arg.shift()) {
    case 'init': {
      const init = await import('./lib/init.js');
      init.default(arg);
      break;
    }
    case 'build': {
      const build = await import('./lib/build.js');
      build.default(arg);
      break;
    }
    case 'clean': {
      const clean = await import('./lib/clean.js');
      clean.default(arg);
      break;
    }
    default: {
      console.log(help);
      break;
    }
  }
}
