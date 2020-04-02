const marked = require("marked");
const { InlineLexer, Lexer, TextRenderer } = require("../marked");
const hljs = require("highlight.js");

marked.setOptions({
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    return hljs.highlight(validLanguage, code).value;
  }
});

class Parser extends marked.Parser {
  static parse(tokens, options) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  };
  parse(tokens) {
    this.inline = new InlineLexer(tokens.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(
      tokens.links,
      Object.assign(this.options, { renderer: new TextRenderer() })
    );
    this.tokens = tokens.reverse();

    let out = "";
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };
}

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
  const data = Parser.parse(Lexer.lex(content, opt), opt);
  return pangu(mathjax(data));
};
