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
  var args = [path.join(__dirname, "build.sh"), name];
  if (!post.bibfile) args.push("--nobib");
  var command = spawn("bash", args, {
    stdio: "inherit"
  });

  command.on("exit", (code, signal) => {
    console.log("\033[35mChild process terminated with exit code: " + code + "\033[0m");
  });
}

module.exports = build;
