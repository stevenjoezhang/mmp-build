import fs from 'fs';
import { parse } from 'hexo-front-matter';
import { Post } from './post';

async function generator(name: string, htmlMode: boolean) {
  const file = fs.readFileSync(`${name}.md`);
  const post = new Post(parse(file.toString()), name);

  const _content = post.getRawContent();
  if (htmlMode) {
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
  return post.isBibEnabled();
}

export default generator;
