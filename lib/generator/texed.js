const marked = require("marked");

marked.InlineLexer.rules.em = /^\*((?:\*\*|[^*])+?)\*(?!\*)/;

marked.Renderer.prototype.code = function(code, infostring, escaped) {
  var lang = (infostring || '').match(/\S*/)[0];
  return `\\begin{lstlisting}[numbers=left, numberstyle=\\tiny, ${lang ? `language=${lang},` : ''}
keywordstyle=\\color{red}, commentstyle=\\color{gray},
stringstyle=\\color{orange}, showstringspaces=false, identifierstyle=\\color{blue},
frame=shadowbox, rulesepcolor=\\color{gray}, basicstyle=\\ttfamily]
${code}
\\end{lstlisting}\n`;
};

marked.Renderer.prototype.blockquote = function(quote) {
  return `\\begin{quotation}\n\\textit{${quote}}\\end{quotation}\n`;
};

marked.Renderer.prototype.heading = function(text, level, raw, slugger) {
  var levels = ['chapter', 'part', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph']; //chapter works in \documentclass{report}
  return `\\${levels[level]}{${text}}\n`;
};

marked.Renderer.prototype.hr = function() {
  return `\\begin{center}\\rule{0.5\\linewidth}{\\linethickness}\\end{center}`;
};

marked.Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'enumerate' : 'itemize',
      startatt = (ordered && start !== 1) ? (`\\setcounter{enumi}{${start}}\n`) : '';
  return `\\begin{${type}}\n${startatt}${body}\\end{${type}}\n`;
};

marked.Renderer.prototype.listitem = function(text) {
  return `\\item ${text}\n`;
};

marked.Renderer.prototype.paragraph = function(text) {
  return `\n${text}\n`;
};

marked.Renderer.prototype.table = function(header, body, align) {
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

marked.Renderer.prototype.tablerow = function(content) {
  return `${content}\n`;
};

marked.Renderer.prototype.tablecell = function(content, flags) {
  return content;
};

// span level renderer
marked.Renderer.prototype.strong = function(text) {
  return `\\textbf{${text}}`;
};

marked.Renderer.prototype.em = function(text) {
  return `\\textit{${text}}`;
};

marked.Renderer.prototype.codespan = function(text) {
  return `\\texttt{\\textcolor{blue}{${text}}}`;
};

marked.Renderer.prototype.br = function() {
  return ' \\\\';
};

marked.Renderer.prototype.del = function(text) {
  return `\\sout{${text}}`;
};

marked.Renderer.prototype.link = function(href, title, text) {
  return `\\href{${href}}{${text}}`;
};

marked.Renderer.prototype.image = function(href, title, text) {
  return `\\begin{center}
\\includegraphics[width=\\columnwidth]{${href}}
\\scriptsize\\text{${text}}
\\end{center}\n`;
};

marked.Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)),
        this.slugger);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          align = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
        cell += i == this.token.header.length - 1 ? ' \\\\' : ' & ';
        switch (this.token.align[i]) {
          case 'right': align += 'r'; break;
          case 'center': align += 'c'; break;
          case 'left': align += 'l'; break;
          default: align += 'l'; break;
        }
        align += '|';
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
          cell += j == row.length - 1 ? ' \\\\' : ' & ';
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body, align);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;

      if (this.token.task) {
        body += this.renderer.checkbox(this.token.checked);
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      // TODO parse inline content if parameter markdown=1
      return this.renderer.html(this.token.text);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
    default: {
      var errMsg = 'Token with "' + this.token.type + '" type was not found.';
      if (this.options.silent) {
        console.log(errMsg);
      } else {
        throw new Error(errMsg);
      }
    }
  }
};

module.exports = function(content) {
  return marked(content).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
};
