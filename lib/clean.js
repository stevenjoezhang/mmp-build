import { spawnSync } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';

function del(files) {
  files.unshift('-v');
  const { status } = spawnSync('rm', files, {
    stdio: 'inherit'
  });

  console.log(chalk.magenta('Child process terminated with exit code: %d'), status);
  process.exit();
}

function confirm(files) {
  process.stdin.once('data', data => {
    const input = data.toString()[0];
    if (input === 'Y' || input === 'y') {
      del(files);
    } else if (input === 'N' || input === 'n') {
      process.exit();
    } else {
      confirm(files);
    }
  });
}

export default function(arg) {
  const name = arg[0];
  const extensions = ['.aux', '.bbl', '.bcf', '.blg', '.dvi', '.lof', '.log',
    '.lot', '.run.xml', '.toc', '.out', '.out.bak'];
  const names = extensions
    .map(extension => name + extension)
    .filter(name => fs.existsSync(name));
  if (names.length) {
    console.log(names);
    console.log('These files will be deleted. Continue? [Y/N]');
    confirm(names);
  } else {
    console.log('No need to clean.');
    process.exit();
  }
}
