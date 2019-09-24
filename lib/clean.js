var spawn = require("child_process").spawn;
var fs = require("fs");

function clean(arg) {
	var name = arg[0];
	var extensions = [".aux", ".bbl", ".bcf", ".blg", ".dvi", ".lof", ".log",
		".lot", ".run.xml", ".toc", ".out", ".out.bak"];
	names = extensions.map(extension => {
		return name + extension;
	});
	names = names.filter(name => {
		return fs.existsSync(name);
	});
	if (names.length) {
		console.log(names);
		console.log("These files will be deleted. Continue? [Y/N]");
		confirm(names);
	}
	else {
		console.log("No need to clean.");
		process.exit();
	}
}

function confirm(files) {
	process.stdin.once("data", function (data) {
		var input = data.toString()[0];
		if (input == "Y" || input == "y") {
			del(files);
		}
		else if (input == "N" || input == "n") {
			process.exit();
		}
		else {
			confirm(files);
		}
	});
}

function del(files) {
	files.unshift("-v");
	var command = spawn("rm", files);

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
		process.exit();
	});
}

module.exports = clean;
