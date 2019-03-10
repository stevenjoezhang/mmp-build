var fs = require("fs");

var template = `---
title:
author:
date:
abstract:
keywords:
---

% Enjoy!
`;

var template_bib = `---
title:
author:
date:
abstract:
keywords:
bibfile:
  style: ieeetr
  name:
---

% Enjoy!
`;

function init(arg) {
	temp = (arg[1] == "--bib" || arg[1] == "-b") ? template_bib : template;
	fs.writeFileSync(arg[0] + ".md", temp);
}

module.exports = init;
