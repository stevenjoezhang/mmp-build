const { type } = require('os');
const { spawn } = require("child_process");
const generator = require("./generator");

function build(arg) {
  var name = arg.shift();
  var config = {
    quiet: arg.includes("--quiet") || arg.includes("-q"),
    tex  : arg.includes("--tex") || arg.includes("-t"),
    html : arg.includes("--html") || arg.includes("-h")
  }
  var post = generator(name, config);
  if (config.html) {
    console.log("\033[35mHTML generating done. Enjoy!\033[0m");
    process.exit();
  }
  if (config.tex) {
    console.log("\033[35mTeX generating done. You can build it manually.\033[0m");
    process.exit();
  } else {
    console.log("\033[35mTeX generating done. Start building...\033[0m");
  }
  texmaker(name, config, post.bibfile);
}

function texmaker(name, config, bib) {
  var recipe = {
    xelatex: config.quiet
      ? ["xelatex", ["-interaction=batchmode", name]]
      : ["texfot", ["xelatex", "-interaction=nonstopmode", "-file-line-error", name]],
    bibtex : ["bibtex", [name]]
  }
  var queue;
  if (bib) {
    queue = [recipe.xelatex, recipe.bibtex, recipe.xelatex, recipe.xelatex];
  } else {
    queue = [recipe.xelatex, recipe.xelatex];
  }
  commands(queue, () => {
    explorer(`${name}.pdf`);
  });
}

function explorer(file) {
  switch (type()) {
    case "Windows_NT":
      spawn("explorer", [`/select,${file}`]);
      break;
    case "Darwin":
      spawn("open", ["-R", file]);
      break;
    default:
      spawn("xdg-open", [file]);
      break;
  }
}

function commands(queue, cb) {
  var args = queue.shift();
  if (!args) {
    cb();
    return;
  }
  var command = spawn(args[0], args[1], {
    stdio: "inherit"
  });

  command.on("exit", (code, signal) => {
    console.log("\033[32mChild process terminated with exit code: " + code + "\033[0m");
    if (code !== 0) {
      console.log("\033[31mThe exit code is non-zero, please check if any errors occur.\033[0m");
    }
    commands(queue, cb);
  });
}

module.exports = build;
