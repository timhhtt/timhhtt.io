# TIMHHTT · 暗物质裂隙

个人网站 / 项目作品集。纯静态站：HTML + CSS + 原生 JavaScript，零框架、零依赖、零构建。

## 文件结构

```
├── index.html          首页（星球主视觉 + 进入空间）
├── projects.html       项目列表
├── inspiration.html    灵感画廊（瀑布流）
├── contact.html        联系页
├── css/style.css       全站样式（配色、动效、响应式都在这）
├── js/main.js          全站交互（星空、闪电、晶体视差、导航、入场动画）
├── js/projects.js      ★ 项目数据 —— 加项目就改这个文件
└── assets/img/         图片目录
    └── hero-planet.jpg 首页星球背景
```

## 本地预览

直接**双击 index.html** 就能在浏览器打开。
（注意：直接双击时部分浏览器会限制字体加载，属正常现象；上传到 GitHub 后无此问题。）

## ★ 如何添加项目（最常用）

1. 用记事本或任意编辑器打开 `js/projects.js`
2. 复制任意一个 `{ ... }` 块，粘贴到大括号数组的末尾
3. 改成你的项目信息，保存，刷新浏览器即可

```js
{
  name: "我的新项目",
  desc: "一两句话介绍这个项目。",
  tags: ["Python", "工具"],
  year: "2026",
  github: "https://github.com/timhhtt/仓库名",
  demo: ""
}
```

链接留空 `""` 就不会显示对应按钮。数量不限，自动排列。

## ★ 如何往灵感页加图

1. 把图片放进 `assets/img/`（建议 JPG，宽 800px 以上）
2. 打开 `inspiration.html`，在最下面的 `GALLERY` 数组里加一行：

```js
{ src: "assets/img/你的图片.jpg", caption: "说明文字" }
```

## 如何修改联系页

打开 `contact.html`：
- 大标题文字在 `<h1 class="contact-line">` 里
- 打字机句子在 `data-text="..."` 里
- 加联系方式：复制一行 `<a class="channel" ...>` 改掉即可（邮箱用 `href="mailto:你的邮箱"`）

## 部署到 GitHub Pages（手把手）

你的网址将是 `https://timhhtt.github.io` （用户主页仓库）。

1. 登录 GitHub，点右上角 **+** → **New repository**
2. 仓库名填 **`timhhtt.github.io`**（必须一字不差，含 `.github.io`），选 Public，点 Create
3. 在仓库页面点 **uploading an existing file**（上传现有文件）
4. 把本文件夹里的**所有文件和文件夹**（index.html、css、js、assets、README）一起拖进上传框，等进度条走完
5. 点 **Commit changes**
6. 等 1~2 分钟，访问 `https://timhhtt.github.io` 就能看到网站

**以后更新**：进入仓库 → 打开要改的文件 → 点铅笔图标编辑 → Commit changes，或者重复第 3~5 步上传覆盖同名文件。

> 如果仓库名不是 `timhhtt.github.io` 而是别的名字（如 `my-site`），
> 网址会变成 `https://timhhtt.github.io/my-site/`，并且需要到
> 仓库 Settings → Pages 里把 Source 设为 `main` 分支开启。
> 所有页面跳转仍可直接用，无需改动（本站使用相对路径）。

## 常见修改

| 想改什么 | 打开哪 | 找哪一行 |
|---|---|---|
| 首页副标题 | `index.html` | `hero-sub-cn` 那行文字 |
| 全站配色 | `css/style.css` | 顶部 `:root` 里的 `--blue` `--purple` |
| 导航栏目名 | `js/main.js` | 顶部 `NAV` 数组 |
| 页脚文字 | `js/main.js` | `buildFooter` 函数 |
| 星球背景图 | 替换 `assets/img/hero-planet.jpg`（同名覆盖即可） | — |
