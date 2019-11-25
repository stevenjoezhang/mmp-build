const { spawn } = require("child_process");
const fs = require("fs");

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
  var command = spawn("rm", files, {
    stdio: "inherit"
  });

  command.on("exit", (code, signal) => {
    console.log("\033[35mChild process terminated with exit code: " + code + "\033[0m");
    process.exit();
  });
}

module.exports = clean;
