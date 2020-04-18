const marked = require("marked");

class Lexer extends marked.Lexer {
  constructor() {
    super(...arguments);
    this.tokenizer.rules.inline.em = /^\*((?:\*\*|[^*])+?)\*(?!\*)/;
  }

  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }
}

module.exports = {
  Lexer
};
