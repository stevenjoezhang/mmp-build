const marked = require("marked");
const { InlineLexer, Lexer, TextRenderer } = require("../marked");

class Renderer extends marked.Renderer {
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/\S*/)[0];
    return `\\begin{lstlisting}[numbers=left, numberstyle=\\tiny, ${lang ? `language=${lang},` : ""}
keywordstyle=\\color{red}, commentstyle=\\color{gray},
stringstyle=\\color{orange}, showstringspaces=false, identifierstyle=\\color{blue},
frame=shadowbox, rulesepcolor=\\color{gray}, basicstyle=\\ttfamily]
${code}
\\end{lstlisting}\n`;
  };

  blockquote(quote) {
    return `\\begin{quotation}\n\\textit{${quote}}\\end{quotation}\n`;
  };

  heading(text, level, raw, slugger) {
    const levels = ["chapter", "part", "section", "subsection", "subsubsection", "paragraph", "subparagraph"]; //chapter works in \documentclass{report}
    return `\\${levels[level]}{${text}}\n`;
  };

  hr() {
    return `\\begin{center}\\rule{0.5\\linewidth}{0.5pt}\\end{center}`;
  };

  list(body, ordered, start) {
    const type = ordered ? "enumerate" : "itemize",
      startatt = (ordered && start !== 1) ? (`\\setcounter{enumi}{${start}}\n`) : "";
    return `\\begin{${type}}\n${startatt}${body}\\end{${type}}\n`;
  };

  listitem(text) {
    return `\\item ${text}\n`;
  };

  checkbox(checked) {
    return checked ? "[\\rlap{\\raisebox{2pt}{\\large\\hspace{1pt}\\ding{51}}}$\\square$]" : "[$\\square$]";
  };

  paragraph(text) {
    return `\n${text}\n`;
  };

  table(header, body, align) {
    return `\\begin{longtable}{|${align}}
\\hline
${header}
\\hline
\\endhead

\\hline
\\endfoot
${body}
\\hline
\\end{longtable}\n`;
  };

  tablerow(content) {
    return `${content}\n`;
  };

  tablecell(content, flags) {
    return content;
  };

  // span level renderer
  strong(text) {
    return `\\textbf{${text}}`;
  };

  em(text) {
    return `\\textit{${text}}`;
  };

  codespan(text) {
    return `\\texttt{\\textcolor{blue}{${text}}}`;
  };

  br() {
    return " \\\\";
  };

  del(text) {
    return `\\sout{${text}}`;
  };

  link(href, title, text) {
    return `\\href{${href}}{${text}}`;
  };

  image(href, title, text) {
    return `\\begin{center}
\\includegraphics[width=\\columnwidth]{${href}}
\\captionof{figure}{${text}}
\\end{center}\n`;
  };
}

class Parser extends marked.Parser {
  constructor() {
    super(...arguments);
    this.options.renderer = new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
  };
  static parse(tokens, options) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  };
  parse(tokens) {
    this.inline = new InlineLexer(tokens.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(
      tokens.links,
      Object.assign(this.options, { renderer: new TextRenderer() })
    );
    this.tokens = tokens.reverse();

    let out = "";
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };
  tok() {
    let body = "";
    switch (this.token.type) {
      case "table": {
        let header = "",
          align = "",
          i,
          row,
          cell,
          j;

        // header
        cell = "";
        for (i = 0; i < this.token.header.length; i++) {
          cell += this.renderer.tablecell(
            this.inline.output(this.token.header[i]),
            { header: true, align: this.token.align[i] }
          );
          cell += i === this.token.header.length - 1 ? " \\\\" : " & ";
          switch (this.token.align[i]) {
            case "right": align += "r"; break;
            case "center": align += "c"; break;
            case "left": align += "l"; break;
            default: align += "l"; break;
          }
          align += "|";
        }
        header += this.renderer.tablerow(cell);

        for (i = 0; i < this.token.cells.length; i++) {
          row = this.token.cells[i];

          cell = "";
          for (j = 0; j < row.length; j++) {
            cell += this.renderer.tablecell(
              this.inline.output(row[j]),
              { header: false, align: this.token.align[j] }
            );
            cell += j === row.length - 1 ? " \\\\" : " & ";
          }

          body += this.renderer.tablerow(cell);
        }
        return this.renderer.table(header, body, align);
      }
      default: {
        return super.tok();
      }
    }
  };
}

function unescape(content) {
  return content
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

module.exports = function(content) {
  const opt = marked.defaults;
  return unescape(Parser.parse(Lexer.lex(content, opt), opt));
};
