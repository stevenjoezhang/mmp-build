const fs = require("fs");

const template = `---
title:
author:
date:
abstract:
keywords:
---

% Enjoy!
`;

const template_bib = `---
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
  var temp = (arg[1] == "--bib" || arg[1] == "-b") ? template_bib : template;
  fs.writeFileSync(arg[0] + ".md", temp);
}

module.exports = init;
