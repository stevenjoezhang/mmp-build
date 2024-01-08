import { marked } from 'marked';
import { Lexer } from '../marked.js';
const placeholder = '\uFFFC';

class Renderer extends marked.Renderer {
  code(code: string, infostring: string | undefined, escaped: boolean) {
    const lang = (infostring || '').match(/\S*/)[0];
    return `\\begin{lstlisting}[numbers=left, numberstyle=\\tiny, ${lang ? `language=${lang},` : ''}
keywordstyle=\\color{red}, commentstyle=\\color{gray},
stringstyle=\\color{orange}, showstringspaces=false, identifierstyle=\\color{blue},
frame=shadowbox, rulesepcolor=\\color{gray}, basicstyle=\\ttfamily]
${code}
\\end{lstlisting}\n`;
  }

  blockquote(quote: string) {
    // Add LaTeX line breaks if there are multiple lines in the quote
    // quote = quote.replace(/\n/g, '\\\\');
    return `\\begin{tcolorbox}\n{\\itshape\\color{gray}${quote}}\\end{tcolorbox}\n`;
  }

  heading(text: string, level: number, raw: string, slugger: marked.Slugger) {
    const levels = ['chapter', 'part', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph']; //chapter works in \documentclass{report}
    return `\\${levels[level]}{${text}}\n`;
  }

  hr() {
    return '\\begin{center}\\rule{0.5\\linewidth}{0.5pt}\\end{center}';
  }

  list(body: string, ordered: boolean, start: number) {
    const type = ordered ? 'enumerate' : 'itemize';
    const startatt = ordered && start !== 1 ? `\\setcounter{enumi}{${start}}\n` : '';
    return `\\begin{${type}}\n${startatt}${body}\\end{${type}}\n`;
  }

  listitem(text: string) {
    return `\\item ${text}\n`;
  }

  checkbox(checked: boolean) {
    return checked ? '[\\rlap{\\raisebox{2pt}{\\large\\hspace{1pt}\\ding{51}}}$\\square$]' : '[$\\square$]';
  }

  paragraph(text: string) {
    return `\n${text}\n`;
  }

  table(header: string, body: string) {
    const reg = new RegExp(placeholder + '\\S' + placeholder, 'g');
    const align = header.match(reg).join('|').replace(new RegExp(placeholder, 'g'), '');
    return `\\begin{longtable}{|${align}|}
\\hline
${header.replace(reg, '')}
\\hline
\\endhead

\\hline
\\endfoot
${body}
\\hline
\\end{longtable}\n`;
  }

  tablerow(content: string) {
    return `${content.replace(/&\s$/, '\\\\')}\n`;
  }

  tablecell(content: string, flags: {
    header: boolean;
    align : 'center' | 'left' | 'right' | null;
  }) {
    if (flags.header) content += placeholder + (flags.align || 'left')[0] + placeholder;
    return content + ' & ';
  }

  // span level renderer
  strong(text: string) {
    return `\\textbf{${text}}`;
  }

  em(text: string) {
    return `\\textit{${text}}`;
  }

  codespan(text: string) {
    return `\\texttt{\\textcolor{blue}{\\detokenize{${text}}}}`;
  }

  br() {
    return ' \\\\';
  }

  del(text: string) {
    return `\\sout{${text}}`;
  }

  link(href: string, title: string, text: string) {
    return `\\href{${href}}{${text}}`;
  }

  image(href: string, title: string, text: string) {
    return `\\begin{center}
\\includegraphics[width=\\columnwidth]{${href}}
\\captionof{figure}{${text}}
${title ? `\\label{${title}}` : ''}
\\end{center}\n`;
  }
}

marked.setOptions({
  renderer: new Renderer()
});

function unescape(content: string) {
  return content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'');
}

export default function(content: string) {
  const opt = marked.defaults;
  const data = marked.Parser.parse(Lexer.lex(content, opt), opt);
  return unescape(data);
}
