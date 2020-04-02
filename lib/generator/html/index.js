const marked = require("marked");
const { InlineLexer, Lexer, TextRenderer } = require("../marked");
const hljs = require("highlight.js");

marked.setOptions({
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
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

    let out = '';
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };
}

const stringWidth = require("string-width");

const config = {
  tags          : "none",
  single_dollars: true,
  cjk_width     : 0.9,
  normal_width  : 0.6
};

//
//  Load the packages needed for MathJax
//
const { mathjax } = require("mathjax-full/js/mathjax.js");
const { TeX } = require("mathjax-full/js/input/tex.js");
const { SVG } = require("mathjax-full/js/output/svg.js");
const { LiteAdaptor } = require("mathjax-full/js/adaptors/liteAdaptor.js");
const { RegisterHTMLHandler } = require("mathjax-full/js/handlers/html.js");

const { AllPackages } = require("mathjax-full/js/input/tex/AllPackages.js");

//
//  Create DOM adaptor and register it for HTML documents
//
class myAdaptor extends LiteAdaptor {
  value(node) {
    return node.value;
  }
  nodeSize(node) {
    const cjk = this.options.cjkWidth;
    const width = this.options.normalWidth;
    const text = this.textContent(node);
    let w = 0;
    for (const c of text.split("")) {
      w += (stringWidth(c) === 2 ? cjk : width);
    }
    return [w, 0];
  }
}
myAdaptor.OPTIONS = {
  ...LiteAdaptor.OPTIONS,
  cjkWidth   : 0.9,
  normalWidth: 0.6
};

const adaptor = new myAdaptor({
  fontSize   : 16,
  cjkWidth   : config.cjk_width,
  normalWidth: config.normal_width
});
RegisterHTMLHandler(adaptor);

const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const { window } = dom;
const { document, Node, DocumentFragment, XPathResult } = window;
global.document = document;
global.Node = Node;
global.DocumentFragment = DocumentFragment;
global.XPathResult = XPathResult;
const pangu = require('pangu/src/browser/pangu');

module.exports = function(content) {
  const opt = marked.defaults;
  const data = Parser.parse(Lexer.lex(content, opt), opt);

  //
  //  Create input and output jax and a document using them on the content from the HTML file
  //
  const tex = new TeX({
    packages  : AllPackages,
    tags      : config.tags,
    inlineMath: config.single_dollars ? {
      "[+]": [["$", "$"]]
    } : {}
  });
  const svg = new SVG({
    fontCache: "global"
  });
  const html = mathjax.document(data, {
    InputJax : tex,
    OutputJax: svg
  });

  //
  //  Typeset the document
  //
  html.render();

  //
  //  Output the resulting HTML
  //
  document.body.innerHTML = adaptor.innerHTML(adaptor.body(html.document));
  pangu.spacingPageBody();
  return document.body.innerHTML;
};
