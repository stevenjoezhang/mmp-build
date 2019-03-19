# MMP

MMP的全称是Mimi Markdown Paper，旨在通过简单的命令将Markdown文件转为TeX，再通过`xelatex`编译为pdf。据研究表明，这可以将写文章的效率提升1400%。

## 依赖

使用前请务必安装并配置好LaTeX环境，确保`xelatex`和`bibtex`可以被正确执行。  
同时还需要安装`node`和`npm`。

## 安装

执行
```bash
npm install mmp-build -g
```
如果你的`npm`全局模块目录（例如`/usr/local/lib/node_modules`）的权限设置不同，请加上`sudo`：
```bash
sudo npm install mmp-build -g
```

## 使用

### 准备

你的项目需要有一个名字，我们就叫他`$name`好了。你需要准备一个名为`$name.md`的文件，它需要符合Markdown的语法，并且可以包含LaTeX的语法。如果有参考文献的话，在同一目录下需要存在名为`$name.bib`的BiBTeX文件。

接下来需要介绍Markdown文件的语法。我们使用了Front Matter，这来源于静态博客框架Hexo。它看起来像这样：

### 命令

当然，创建文件的部分不一定需要你来手动完成。你可以通过`mmp`的子命令执行。下面是全部用法：

- 在当前目录新建`$name.md`
```bash
mmp init $name
```
- 在当前目录新建`$name.md`和`$name.bib`
```bash
mmp init $name --bib
mmp init $name -b
```
- 在当前目录编译`$name.md`为`$name.tex`，再编译为`$name.pdf`
```bash
mmp build $name
```
注意，如果在markdown文件的From Matter中设置了`bibfile`，会自动执行多次`xelatex`
- 与前面相同，但在执行`xelatex`时使用静默模式，减少输出（报错信息也不会显示）
```bash
mmp build $name --quiet
mmp build $name -q
```
- 在当前目录编译`$name.md`为`$name.tex`，不进行其他操作
```bash
mmp build $name --tex
mmp build $name -t
```
- 在当前目录编译`$name.md`为`$name.html`，不进行其他操作
```bash
mmp build $name --html
mmp build $name -h
```
如果要渲染数学公式，请手动向`html`页面添加`mathjax`
- 在当前目录清除与`$name.md`有关的编译缓存，只留下（如果存在）`$name.md`，`$name.tex`，`$name.bib`和`$name.pdf`
```bash
mmp clean $name
```

## 鸣谢

在Markdown文件中使用Front Matter存储元信息是一种极为方便的做法。  
Marked是一个将Markdown文件转为html的node模块。在此基础上开发了Markdown转TeX的核心。

## Known Issues

`marked`会强制将`&<>"'`这些字符转码（目的是防止污染`html`）。为防止问题，使用了极为不优美的方法把这些字符换回来。

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
