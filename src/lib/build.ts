import { type } from 'os';
import { spawnSync } from 'child_process';
import generator from './generator/index.js';
import pc from 'picocolors';

interface Config {
  quiet: boolean;
  tex  : boolean;
  html : boolean;
}

interface Recipe {
  xelatex: [string, string[]];
  bibtex : [string, string[]];
}

function explorer(file: string) {
  switch (type()) {
    case 'Windows_NT':
      spawnSync('explorer', [`/select,${file}`]);
      break;
    case 'Darwin':
      spawnSync('open', ['-R', file]);
      break;
    default:
      spawnSync('xdg-open', [file]);
      break;
  }
}

function texmaker(name: string, config: Config, bib: boolean) {
  const recipe: Recipe = {
    xelatex: config.quiet
      ? ['xelatex', ['-interaction=batchmode', name]]
      : ['texfot', ['xelatex', '-interaction=nonstopmode', '-file-line-error', name]],
    bibtex: ['bibtex', [name]]
  };
  let queue;
  if (bib) {
    queue = [recipe.xelatex, recipe.bibtex, recipe.xelatex, recipe.xelatex];
  } else {
    queue = [recipe.xelatex, recipe.xelatex];
  }
  queue.forEach(args => {
    const { status } = spawnSync(args[0], args[1], {
      stdio: 'inherit'
    });

    console.log(pc.green('Child process terminated with exit code: %d'), status);
    if (status !== 0) {
      console.log(pc.red('The exit code is non-zero, please check if any errors occur.'));
    }
  });
  explorer(`${name}.pdf`);
}

export default async function(arg: string[]) {
  const name = arg.shift();
  if (!name) {
    console.error('Missing filename.');
    process.exit();
  }
  const config = {
    quiet: arg.includes('--quiet') || arg.includes('-q'),
    tex  : arg.includes('--tex') || arg.includes('-t'),
    html : arg.includes('--html') || arg.includes('-h')
  };
  const enableBibfile = await generator(name, config.html);
  if (config.html) {
    console.log(pc.magenta('HTML generating done. Enjoy!'));
    process.exit();
  }
  if (config.tex) {
    console.log(pc.magenta('TeX generating done. You can build it manually.'));
    process.exit();
  } else {
    console.log(pc.magenta('TeX generating done. Start building...'));
  }
  texmaker(name, config, enableBibfile);
}
