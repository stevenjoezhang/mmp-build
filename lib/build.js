const { type } = require('os');
const { spawnSync } = require('child_process');
const generator = require('./generator');
const chalk = require('chalk');

function explorer(file) {
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

function texmaker(name, config, bib) {
  const recipe = {
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

    console.log(chalk.green('Child process terminated with exit code: %d'), status);
    if (status !== 0) {
      console.log(chalk.red('The exit code is non-zero, please check if any errors occur.'));
    }
  });
  explorer(`${name}.pdf`);
}

module.exports = function(arg) {
  const name = arg.shift();
  const config = {
    quiet: arg.includes('--quiet') || arg.includes('-q'),
    tex  : arg.includes('--tex') || arg.includes('-t'),
    html : arg.includes('--html') || arg.includes('-h')
  };
  const post = generator(name, config);
  if (config.html) {
    console.log(chalk.magenta('HTML generating done. Enjoy!'));
    process.exit();
  }
  if (config.tex) {
    console.log(chalk.magenta('TeX generating done. You can build it manually.'));
    process.exit();
  } else {
    console.log(chalk.magenta('TeX generating done. Start building...'));
  }
  texmaker(name, config, post.bibfile);
};
