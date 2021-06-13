import marked from 'marked';
import { edit } from 'marked/src/helpers.js';

class Lexer extends marked.Lexer {
  constructor() {
    super(...arguments);
    this.tokenizer.rules.inline.emStrong.lDelim = edit(/^(?:\*+(?:([punct_])|[^\s*]))/)
      .replace(/punct/g, this.tokenizer.rules.inline._punctuation)
      .getRegex();
  }

  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }
}

export {
  Lexer
};
