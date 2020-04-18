const marked = require("marked");
const { Lexer } = require("../marked");
const placeholder = "\uFFFC";

class Renderer extends marked.Renderer {
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/\S*/)[0];
    return `\\begin{lstlisting}[numbers=left, numberstyle=\\tiny, ${lang ? `language=${lang},` : ""}
keywordstyle=\\color{red}, commentstyle=\\color{gray},
stringstyle=\\color{orange}, showstringspaces=false, identifierstyle=\\color{blue},
frame=shadowbox, rulesepcolor=\\color{gray}, basicstyle=\\ttfamily]
${code}
\\end{lstlisting}\n`;
  }

  blockquote(quote) {
    return `\\begin{quotation}\n\\textit{${quote}}\\end{quotation}\n`;
  }

  heading(text, level, raw, slugger) {
    const levels = ["chapter", "part", "section", "subsection", "subsubsection", "paragraph", "subparagraph"]; //chapter works in \documentclass{report}
    return `\\${levels[level]}{${text}}\n`;
  }

  hr() {
    return `\\begin{center}\\rule{0.5\\linewidth}{0.5pt}\\end{center}`;
  }

  list(body, ordered, start) {
    const type = ordered ? "enumerate" : "itemize",
      startatt = (ordered && start !== 1) ? `\\setcounter{enumi}{${start}}\n` : "";
    return `\\begin{${type}}\n${startatt}${body}\\end{${type}}\n`;
  }

  listitem(text) {
    return `\\item ${text}\n`;
  }

  checkbox(checked) {
    return checked ? "[\\rlap{\\raisebox{2pt}{\\large\\hspace{1pt}\\ding{51}}}$\\square$]" : "[$\\square$]";
  }

  paragraph(text) {
    return `\n${text}\n`;
  }

  table(header, body) {
    let reg = new RegExp(placeholder + "\\S" + placeholder, "g");
    let align = header.match(reg).join("|").replace(new RegExp(placeholder, "g"), "");
    return `\\begin{longtable}{|${align}|}
\\hline
${header.replace(reg, "")}
\\hline
\\endhead

\\hline
\\endfoot
${body}
\\hline
\\end{longtable}\n`;
  }

  tablerow(content) {
    return `${content.replace(/&\s$/, "\\\\")}\n`;
  }

  tablecell(content, flags) {
    if (flags.header) content += placeholder + (flags.align || "left")[0] + placeholder;
    return content + " & ";
  }

  // span level renderer
  strong(text) {
    return `\\textbf{${text}}`;
  }

  em(text) {
    return `\\textit{${text}}`;
  }

  codespan(text) {
    return `\\texttt{\\textcolor{blue}{${text}}}`;
  }

  br() {
    return " \\\\";
  }

  del(text) {
    return `\\sout{${text}}`;
  }

  link(href, title, text) {
    return `\\href{${href}}{${text}}`;
  }

  image(href, title, text) {
    return `\\begin{center}
\\includegraphics[width=\\columnwidth]{${href}}
\\captionof{figure}{${text}}
\\end{center}\n`;
  }
}

marked.setOptions({
  renderer: new Renderer()
});

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
  const data = marked.Parser.parse(Lexer.lex(content, opt), opt);
  return unescape(data);
};
