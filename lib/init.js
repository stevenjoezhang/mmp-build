import fs from 'fs';

const template = `---
title:
author:
date:
abstract:
keywords:
packages:
---

% Enjoy!
`;

const template_bib = `---
title:
author:
date:
abstract:
keywords:
packages:
bibfile:
  style: ieeetr
  name:
---

% Enjoy!
`;

export default function(arg) {
  const file = arg[0] + '.md';
  const temp = arg[1] === '--bib' || arg[1] === '-b' ? template_bib : template;
  if (fs.existsSync(file)) {
    console.warn('File already exists:', file);
    console.warn('Abort.');
  } else {
    fs.writeFileSync(file, temp);
  }
}
