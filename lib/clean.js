const { spawnSync } = require("child_process");
const fs = require("fs");
const chalk = require("chalk");

function clean(arg) {
  var name = arg[0];
  var extensions = [".aux", ".bbl", ".bcf", ".blg", ".dvi", ".lof", ".log",
    ".lot", ".run.xml", ".toc", ".out", ".out.bak"];
  names = extensions
    .map(extension => name + extension)
    .filter(name => fs.existsSync(name));
  if (names.length) {
    console.log(names);
    console.log("These files will be deleted. Continue? [Y/N]");
    confirm(names);
  } else {
    console.log("No need to clean.");
    process.exit();
  }
}

function confirm(files) {
  process.stdin.once("data", data => {
    var input = data.toString()[0];
    if (input == "Y" || input == "y") {
      del(files);
    } else if (input == "N" || input == "n") {
      process.exit();
    } else {
      confirm(files);
    }
  });
}

function del(files) {
  files.unshift("-v");
  let { status } = spawnSync("rm", files, {
    stdio: "inherit"
  });

  console.log(chalk.magenta("Child process terminated with exit code: %d"), status);
  process.exit();
}

module.exports = clean;
