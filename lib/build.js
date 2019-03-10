var fs = require("fs");
var spawn = require("child_process").spawn;
var path = require("path");
var marked = require("./marked");
var fm = require("./front-matter");

function build(name, config) {
	var config = config || {};
	var file = fs.readFileSync(`${name}.md`);
	var post = fm.parse(file.toString());
	post.getPackages = () => {
		if (!post.packages) return "";
		var content = typeof post.packages == "string" ? post.packages : post.packages.join(", ");
		return `\\usepackage{${content}}`;
	}
	post.getDateString = () => {
		var date = post.date || new Date();
		return date.getFullYear() + "年" +
			(date.getMonth() + 1) + "月" +
			date.getDate() + "日";
	}
	post.getKeywords = () => {
		if (!post.keywords) return "";
		var content = typeof post.keywords == "string" ? post.keywords : post.keywords.join(", ");
		return `\\begin{center}
\\small
\\textbf{\\textit{关键词：}}{${content}}
\\end{center}`;
	}
	post.getBibItem = () => {
		if (post.bibfile && post.bibfile.style) {
			return `\\newpage
\\bibliographystyle{${post.bibfile.style}}
\\bibliography{${post.bibfile.name || name}}`;
		}
		else return "";
	}
	var tex = `\\documentclass[12pt]{article}
\\usepackage{ctex, amsmath, amsthm, amssymb, geometry, perpage, float, hyperref, longtable, ulem, listings, xcolor}
${post.getPackages()}
\\usepackage[font={bf, footnotesize}, textfont=md]{caption}
\\makeatletter 
\\newcommand\\fcaption{\\def\\@captype{figure}\\caption}
\\makeatother

\\geometry{a4paper, left=3cm, right=3cm, top=3cm, bottom=3cm}
\\renewcommand{\\thefootnote}{\\fnsymbol{footnote}}
\\MakePerPage{footnote}
\\makeatletter
\\def\\@cite#1#2{\\textsuperscript{[{#1\\if@tempswa , #2\\fi}]}}
\\makeatother

\\title{${post.title || ""}}
\\author{${post.author || ""}}
\\date{${post.getDateString()}}

\\begin{document}

\\maketitle
\\begin{abstract}
${post.abstract || ""}
\\end{abstract}
%\\vspace{8pt}
${post.getKeywords()}

\\setcounter{page}{0}
\\pagenumbering{Roman}
\\tableofcontents
\\newpage
\\setcounter{page}{0}
\\pagenumbering{arabic}
${marked(post._content)}
${post.getBibItem()}
\\end{document}`;

	fs.writeFileSync(`${name}.tex`, tex);
	if (!config.build) {
		console.log("\033[35mTeX generating done. Please execute the following command manually:\033[0m");
		console.log(`\nbash build.sh ${name}\n`);
		process.exit();
	}
	else console.log("\033[35mTeX generating done. Start building...\033[0m");
	var command = spawn("bash", [path.join(__dirname, "build.sh"), name]);

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
