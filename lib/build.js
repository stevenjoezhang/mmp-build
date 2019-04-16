var spawn = require("child_process").spawn;
var path = require("path");
var generator = require("./generator");

function build(arg) {
	var name = arg.shift();
	var config = {
		build: arg.indexOf("--tex") == -1 && arg.indexOf("-t") == -1,
		html: arg.indexOf("--html") != -1 || arg.indexOf("-h") != -1
	}
	var post = generator(name, config);
	if (config.html) {
		console.log("\033[35mHTML generating done. Enjoy!\033[0m");
		process.exit();
	}
	if (!config.build) {
		console.log("\033[35mTeX generating done. You can build it manually.\033[0m");
		//console.log(`\nbash build.sh ${name}\n`);
		process.exit();
	}
	else console.log("\033[35mTeX generating done. Start building...\033[0m");
	var args = [path.join(__dirname, "build.sh"), name];
	if (!post.bibfile) args.push("--nobib");
	var command = spawn("bash", args);

	command.stdout.on("data", (data) => {
		process.stdout.write(data);
	});

	// 捕获标准错误输出并将其打印到控制台 
	command.stderr.on("data", (data) => {
		process.stdout.write(data);
	});

	// 注册子进程关闭事件 
	command.on("exit", (code, signal) => {
		console.log("\033[35mChild process terminated with exit code: " + code + "\033[0m");
	});
}
module.exports = build;
