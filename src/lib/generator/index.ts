import fs from 'fs';
import { parse } from 'hexo-front-matter';

async function generator(name, config) {
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
    const html = await import('./html/index.js');
    const htmlTemplate = await import('./html/template.js');
    post.content = html.default(_content);
    const result = htmlTemplate.default(post);
    fs.writeFileSync(`${name}.html`, result);
  } else {
    const tex = await import('./tex/index.js');
    const texTemplate = await import('./tex/template.js');
    post.content = tex.default(_content);
    const result = texTemplate.default(post);
    fs.writeFileSync(`${name}.tex`, result);
  }
  return post;
}

export default generator;
