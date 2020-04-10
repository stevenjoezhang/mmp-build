const marked = require("marked");

class Lexer extends marked.Lexer {
  constructor() {
    super(...arguments);
    this.rules.inline.em = /^\*((?:\*\*|[^*])+?)\*(?!\*)/;
  }
}

module.exports = {
  Lexer
};
