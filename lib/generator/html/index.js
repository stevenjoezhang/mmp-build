const marked = require("marked");
const { Lexer } = require("../marked");
const hljs = require("highlight.js");

marked.setOptions({
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    return hljs.highlight(validLanguage, code).value;
  }
});

const config = {
  tags          : "none",
  single_dollars: true,
  cjk_width     : 0.9,
  normal_width  : 0.6
};

const mathjax = require("hexo-filter-mathjax/lib/filter")(config);
const pangu = require("hexo-pangu/lib/filter");

module.exports = function(content) {
  const opt = marked.defaults;
  const data = marked.Parser.parse(Lexer.lex(content, opt), opt);
  return pangu(mathjax(data));
};
