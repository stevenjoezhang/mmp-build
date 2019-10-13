const { spawn } = require("child_process");
const path = require("path");
const generator = require("./generator");

function build(arg) {
  var name = arg.shift();
  var config = {
    build: arg.indexOf("--tex") == -1 && arg.indexOf("-t") == -1,
    html : arg.indexOf("--html") != -1 || arg.indexOf("-h") != -1
  }
  var post = generator(name, config);
  if (config.html) {
    console.log("\033[35mHTML generating done. Enjoy!\033[0m");
    process.exit();
  }
  if (config.build) {
    console.log("\033[35mTeX generating done. Start building...\033[0m");
  } else {
    console.log("\033[35mTeX generating done. You can build it manually.\033[0m");
    //console.log(`\nbash build.sh ${name}\n`);
    process.exit();
  }
  texmaker(name, post.bibfile);
}

function texmaker(name, bib) {
  var recipe = {
    xelatex: ["xelatex", ["--interaction=batchmode", name]],
    bibtex: ["bibtex", [name]]
  }
  var queue;
  if (bib) {
    queue = [recipe.xelatex, recipe.bibtex, recipe.xelatex, recipe.xelatex];
  } else {
    queue = [recipe.xelatex, recipe.xelatex];
  }
  commands(queue);
}

function commands(queue) {
  var args = queue.shift();
  if (!args) return;
  var command = spawn(args[0], args[1], {
    stdio: "inherit"
  });

  command.on("exit", (code, signal) => {
    console.log("\033[32mChild process terminated with exit code: " + code + "\033[0m");
    if (code !== 0) {
      console.log("\033[31mThe exit code is non-zero, please check if any errors occur.\033[0m");
    }
    commands(queue);
  });
}

module.exports = build;
