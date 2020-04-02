module.exports = function(post) {
  return `\\documentclass[12pt]{article}

\\usepackage{ctex, amsmath, amsthm, amssymb, geometry, perpage, graphicx, hyperref, longtable, ulem, listings, xcolor, pifont}
${post.getPackages()}
\\usepackage[font={bf, footnotesize}, textfont=md, hypcap=false]{caption}

\\geometry{a4paper, left=3cm, right=3cm, top=3cm, bottom=3cm}
\\renewcommand{\\thefootnote}{\\fnsymbol{footnote}}
\\MakePerPage{footnote}
\\makeatletter
\\def\\@cite#1#2{\\textsuperscript{[{#1\\if@tempswa , #2\\fi}]}}
\\makeatother

\\lstset{
breaklines=true,
postbreak=\\mbox{\\textcolor{red}{$\\hookrightarrow$}\\space}
}

\\title{${post.title || ""}}
\\author{${post.author || ""}}
\\date{${post.getDateString()}}

\\begin{document}

\\maketitle
${post.getAbstract()}

%\\vspace{8pt}
${post.getKeywords()}

\\setcounter{page}{0}
\\pagenumbering{Roman}
\\tableofcontents
\\newpage
\\setcounter{page}{0}
\\pagenumbering{arabic}
${post.content}
${post.getBibItem()}
\\end{document}`;

}
