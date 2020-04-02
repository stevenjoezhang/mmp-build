const fs = require("fs");
const fm = require("hexo-front-matter");

function generator(name, config) {
  let file = fs.readFileSync(`${name}.md`);
  let post = fm.parse(file.toString());

  post.getPackages = () => {
    if (!post.packages) return "";
    let content = typeof post.packages === "string" ? post.packages : post.packages.join(", ");
    return `\\usepackage{${content}}`;
  }
  post.getDateString = () => {
    let date = post.date || new Date();
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  post.getAbstract = () => {
    if (!post.abstract) return "";
    return `\\begin{abstract}
${post.abstract}
\\end{abstract}`;
  }
  post.getKeywords = () => {
    if (!post.keywords) return "";
    let content = typeof post.keywords === "string" ? post.keywords : post.keywords.join(", ");
    return `\\begin{center}
\\small
\\textbf{\\textit{关键词：}}{${content}}
\\end{center}`;
  }
  post.getBibItem = () => {
    if (!post.bibfile) return "";
    return `\\newpage
\\bibliographystyle{${post.bibfile.style || "ieeetr"}}
\\bibliography{${post.bibfile.name || name}}`;
  }

  let { _content } = post;
  if (config.html) {
    post.content = require("./html")(_content);
    let result = require("./html/template")(post);
    fs.writeFileSync(`${name}.html`, result);
  } else {
    post.content = require("./tex")(_content);
    let result = require("./tex/template")(post);
    fs.writeFileSync(`${name}.tex`, result);
  }
  return post;
}

module.exports = generator;
