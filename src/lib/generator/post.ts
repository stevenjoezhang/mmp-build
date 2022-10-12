export class Post {
  post: any;
  name: string;
  content: string;

  constructor(post: any, name: string) {
    this.post = post;
    this.name = name;
  }

  getTitle() {
    return this.post.title || '';
  }

  getAuthor() {
    return this.post.author || '';
  }

  getRawContent() {
    return this.post._content;
  }

  getPackages() {
    if (!this.post.packages) return '';
    const content = typeof this.post.packages === 'string' ? this.post.packages : this.post.packages.join(', ');
    return `\\usepackage{${content}}`;
  }

  getDateString() {
    const date = this.post.date || new Date();
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  getAbstract() {
    if (!this.post.abstract) return '';
    return `\\begin{abstract}
${this.post.abstract}
\\end{abstract}`;
  }

  getKeywords() {
    if (!this.post.keywords) return '';
    const content = typeof this.post.keywords === 'string' ? this.post.keywords : this.post.keywords.join(', ');
    return `\\begin{center}
\\small
\\textbf{\\textit{关键词：}}{${content}}
\\end{center}`;
  }

  isBibEnabled() {
    return this.post.bibfile;
  }

  getBibItem() {
    if (!this.isBibEnabled()) return '';
    return `\\newpage
\\bibliographystyle{${this.post.bibfile.style || 'ieeetr'}}
\\bibliography{${this.post.bibfile.name || this.name}}`;
  }
}
