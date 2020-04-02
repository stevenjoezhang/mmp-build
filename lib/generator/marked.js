const marked = require("marked");
const { Lexer, TextRenderer } = marked;

class InlineLexer extends marked.InlineLexer {
  constructor() {
    super(...arguments);
    this.rules.em = /^\*((?:\*\*|[^*])+?)\*(?!\*)/;
  };
}

module.exports = {
  InlineLexer,
  Lexer,
  TextRenderer
};
