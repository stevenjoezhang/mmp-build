const fs = require('fs');
const { parse } = require('hexo-front-matter');

function generator(name, config) {
  const file = fs.readFileSync(`${name}.md`);
  const post = parse(file.toString());

  post.getPackages = () => {
    if (!post.packages) return '';
    const content = typeof post.packages === 'string' ? post.packages : post.packages.join(', ');
    return `\\usepackage{${content}}`;
  };
  post.getDateString = () => {
    const date = post.date || new Date();
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  post.getAbstract = () => {
    if (!post.abstract) return '';
    return `\\begin{abstract}
${post.abstract}
\\end{abstract}`;
  };
  post.getKeywords = () => {
    if (!post.keywords) return '';
    const content = typeof post.keywords === 'string' ? post.keywords : post.keywords.join(', ');
    return `\\begin{center}
\\small
\\textbf{\\textit{关键词：}}{${content}}
\\end{center}`;
  };
  post.getBibItem = () => {
    if (!post.bibfile) return '';
    return `\\newpage
\\bibliographystyle{${post.bibfile.style || 'ieeetr'}}
\\bibliography{${post.bibfile.name || name}}`;
  };

  const { _content } = post;
  if (config.html) {
    post.content = require('./html')(_content);
    const result = require('./html/template')(post);
    fs.writeFileSync(`${name}.html`, result);
  } else {
    post.content = require('./tex')(_content);
    const result = require('./tex/template')(post);
    fs.writeFileSync(`${name}.tex`, result);
  }
  return post;
}

module.exports = generator;
