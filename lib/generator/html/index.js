import marked from 'marked';
import { Lexer } from '../marked.js';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: function(code, language) {
    language = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

const config = {
  tags          : 'none',
  single_dollars: true,
  cjk_width     : 0.9,
  normal_width  : 0.6
};

import mathjax from 'hexo-filter-mathjax/lib/filter.js';
const renderer = mathjax(config);
import pangu from 'hexo-pangu/lib/filter.js';

export default function(content) {
  const opt = marked.defaults;
  const data = marked.Parser.parse(Lexer.lex(content, opt), opt);
  return pangu(renderer(data));
}
