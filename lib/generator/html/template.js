const fs = require("fs");
const path = require("path");
const css = require("hexo-filter-mathjax/lib/css");

module.exports = function(post) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${post.title || ""}</title>
<style>
body {
  font-size: large;
}
pre {
  overflow-x: scroll;
}
${css}
${fs.readFileSync(path.join(__dirname, "../../../node_modules/highlight.js/styles/xcode.css"))}
</style>
<!-- http://epsilonexpert.com/e/user_questions/html_snippets.php?i=1 -->
<style>
body {counter-reset: h2}
  h2 {counter-reset: h3}
  h3 {counter-reset: h4}
  h4 {counter-reset: h5}
  h5 {counter-reset: h6}
  h2:before {counter-increment: h2; content: counter(h2) ". "}
  h3:before {counter-increment: h3; content: counter(h2) "." counter(h3) ". "}
  h4:before {counter-increment: h4; content: counter(h2) "." counter(h3) "." counter(h4) ". "}
  h5:before {counter-increment: h5; content: counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) ". "}
  h6:before {counter-increment: h6; content: counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) "." counter(h6) ". "}
  h2.nocount:before, h3.nocount:before, h4.nocount:before, h5.nocount:before, h6.nocount:before { content: ""; counter-increment: none }
</style>
</head>
<body>
${post.content}
</body>
</html>`;

}
