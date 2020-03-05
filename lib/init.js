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
  let file = arg[0] + ".md";
  let temp = (arg[1] === "--bib" || arg[1] === "-b") ? template_bib : template;
  if (fs.existsSync(file)) {
    console.warn("File already exists:", file);
    console.warn("Abort.");
  } else {
    fs.writeFileSync(file, temp);
  }
}

module.exports = init;
