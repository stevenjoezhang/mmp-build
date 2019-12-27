# MMP

[![Npm Version](https://img.shields.io/npm/v/mmp-build?style=flat-square)](https://npmjs.org/package/mmp-build)
[![Npm Downloads Month](https://img.shields.io/npm/dm/mmp-build?style=flat-square)](https://npmjs.org/package/mmp-build)
[![Npm Downloads Total](https://img.shields.io/npm/dt/mmp-build?style=flat-square)](https://npmjs.org/package/mmp-build)
[![License](https://img.shields.io/npm/l/mmp-build?style=flat-square)](https://npmjs.org/package/mmp-build)

MMP 的全称是 Mimi Markdown Paper，旨在通过简单的命令将 Markdown 文件转为 TeX，再通过 `xelatex` 编译为 pdf。据研究表明，这可以将写文章的效率提升 1400%。

## 依赖

使用前请务必安装并配置好 LaTeX 环境，确保 `xelatex` 和 `bibtex` 可以被正确执行。  
同时还需要安装 `node` 和 `npm`。

## 安装

执行
```bash
npm install mmp-build -g
```

## 使用

### 准备

你的项目需要有一个名字，我们就叫他 `$name` 好了。你需要准备一个名为 `$name.md` 的文档；如果有参考文献的话，在同一目录下还需要存在名为 `$name.bib` 的BiBTeX文件。  
接下来介绍 `$name.md` 文档应包含的内容。我们采用了一个称为 Front Matter 的部分，它看起来像这样：
```
---
title: Introduction to MMP
author: Mimi
date: 1984-01-24
abstract: How to use MMP
keywords: Markdown, TeX
bibfile:
  style: ieeetr
  name:
---
```
Front Matter 包含了文章的元信息。在它之后就是文章的内容，需要符合 Markdown 的语法，并且可以包含 LaTeX 的语法。

### 命令

当然，创建文件的部分不一定需要你来手动完成。你可以通过 `mmp` 的子命令执行。下面是全部用法：

#### `init` 命令

- 在当前目录新建 `$name.md`
  ```bash
  mmp init $name
  ```
- 在当前目录新建 `$name.md` 和 `$name.bib`
  ```bash
  mmp init $name --bib
  mmp init $name -b
  ```

#### `build` 命令

- 在当前目录编译 `$name.md` 为 `$name.tex`，再编译为 `$name.pdf`
  ```bash
  mmp build $name
  ```
  如果在 Markdown 文件的 From Matter 中设置了 `bibfile`，程序会自动执行多次 `xelatex`
- 在当前目录编译 `$name.md` 为 `$name.tex`，不进行其他操作
  ```bash
  mmp build $name --tex
  mmp build $name -t
  ```
- 在当前目录编译 `$name.md` 为 `$name.html`，不进行其他操作
  ```bash
  mmp build $name --html
  mmp build $name -h
  ```

#### `clean` 命令

- 在当前目录清除与 `$name.md` 有关的编译缓存，只留下（如果存在）`$name.md`，`$name.tex`，`$name.bib` 和 `$name.pdf`
  ```bash
  mmp clean $name
  ```

## 鸣谢

在 Markdown 文件中使用 Front Matter 存储元信息是一种极为方便的做法，本项目使用的代码来源于静态博客框架 Hexo。  
Marked 是一个将 Markdown 文档转为 html 的 NodeJs 模块。在此基础上开发了 Markdown 转 TeX 的核心。

## License

Released under the GNU General Public License v3  
http://www.gnu.org/licenses/gpl-3.0.html

## Known Issues

`marked` 会强制将 `&<>"'` 这些字符转码（目的是防止污染 `html`）。由于这对于 TeX 而言是不必要的，本项目使用了极为不优美的方法把这些字符换回来。

```javascript
/**
 * Helpers
 */

function escape(html, encode) {
  if (encode) {
    if (escape.escapeTest.test(html)) {
      return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
    }
  } else {
    if (escape.escapeTestNoEncode.test(html)) {
      return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
    }
  }

  return html;
}

escape.escapeTest = /[&<>"']/;
escape.escapeReplace = /[&<>"']/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
```

## TODO

- [x] Windows support
- [ ] Nunjucks template support
- [ ] Plugins support (e.g. iCircuitikz)
