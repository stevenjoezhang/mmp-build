var fs = require("fs");
var fm = require("./front-matter");

function generator(name, config) {
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
		if (post.bibfile) {
			return `\\newpage
\\bibliographystyle{${post.bibfile.style || "ieeetr"}}
\\bibliography{${post.bibfile.name || name}}`;
		}
		else return "";
	}
	if (config.html) {
		post.marked = require("marked");
		var result = require("./template/html")(post);
		fs.writeFileSync(`${name}.html`, result);
	}
	else {
		post.texed = require("./texed");
		var result = require("./template/tex")(post);
		fs.writeFileSync(`${name}.tex`, result);
	}
}

module.exports = generator;
