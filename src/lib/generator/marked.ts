import { marked } from 'marked';

// `edit` is not exported by marked, let's copy it here
// https://github.com/markedjs/marked/blob/master/src/helpers.js
const caret = /(^|[^\[])\^/g;
function edit(regex, opt: string = '') {
  regex = typeof regex === 'string' ? regex : regex.source;
  opt = opt || '';
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, '$1');
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}

class Lexer extends marked.Lexer {
  tokenizer: any;

  constructor(options) {
    super(options);
    this.tokenizer.rules.inline.emStrong.lDelim = edit(/^(?:\*+(?:([punct_])|[^\s*]))/)
      .replace(/punct/g, this.tokenizer.rules.inline._punctuation)
      .getRegex();
  }

  static lex(src: string, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }
}

export {
  Lexer
};
