# TIMHHTT · NEON CITY 霓虹都市

个人网站 / 项目作品集 · 赛博朋克主题。
纯静态站：HTML + CSS + 原生 JavaScript，零框架、零依赖、零构建。

## 文件结构

```
├── index.html          首页（终端开机 + 霓虹都市主视觉 + Glitch 大标题）
├── profile.html        个人档案（HUD 风格 ID 卡 + 属性充能条）
├── projects.html       项目仓库
├── gallery.html        霓虹画廊（图片瀑布流）
├── contact.html        联系页（霓虹招牌）
├── css/style.css       全站样式（配色、动效、响应式都在这）
├── js/main.js          全站交互（开机序列、Glitch、鼠标光晕、转场、导航）
├── js/projects.js      ★ 项目数据 —— 加项目就改这个文件
└── assets/img/         图片目录（hero-city.jpg + 4 张画廊图）
```

## 本地预览

直接**双击 index.html** 就能在浏览器打开。
首次打开首页会播放「终端开机」动画（约 4 秒），点击屏幕任意处可跳过；
同一次浏览器会话内只播一次，想再看就换个浏览器或无痕窗口。

## ★ 如何添加项目（最常用）

1. 用记事本或任意编辑器打开 `js/projects.js`
2. 复制任意一个 `{ ... }` 块，粘贴到数组末尾
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

## ★ 如何往画廊加图

1. 把图片放进 `assets/img/`（建议 JPG，宽 800px 以上）
2. 打开 `gallery.html`，在最下面的 `GALLERY` 数组里加一行：

```js
{ src: "assets/img/你的图片.jpg", caption: "说明文字" }
```

## 如何修改档案页 / 联系页

- **档案页**（profile.html）：ID 卡信息在 `.id-rows` 里逐行改；技能条改 `data-level="96"` 的数值；右侧三段文字在 `.panel` 里
- **联系页**（contact.html）：大字在 `<h1 class="neon-sign">`，打字机句子在 `data-text="..."`，加联系方式复制一行 `<a class="channel" ...>` 改掉即可

## 部署到 GitHub Pages（手把手）

你的网址将是 `https://timhhtt.github.io`（用户主页仓库）。

1. 登录 GitHub，点右上角 **+** → **New repository**
2. 仓库名填 **`timhhtt.github.io`**（必须一字不差，含 `.github.io`），选 Public，点 Create
3. 在仓库页面点 **uploading an existing file**（上传现有文件）
4. 把本文件夹里的**所有文件和文件夹**（5 个 html、css、js、assets、README）一起拖进上传框，等进度条走完
5. 点 **Commit changes**
6. 等 1~2 分钟，访问 `https://timhhtt.github.io` 就能看到网站

**以后更新**：进入仓库 → 打开要改的文件 → 点铅笔图标编辑 → Commit changes，
或者重复第 3~5 步上传覆盖同名文件。

> 如果仓库名不是 `timhhtt.github.io` 而是别的名字（如 `my-site`），
> 网址会变成 `https://timhhtt.github.io/my-site/`，并且需要到
> 仓库 Settings → Pages 里把 Source 设为 `main` 分支开启。
> 所有页面跳转仍可直接用，无需改动（本站使用相对路径）。

## 常见修改

| 想改什么 | 打开哪 | 找哪里 |
|---|---|---|
| 首页副标题/按钮文字 | `index.html` | `hero-sub-cn` / `enter-btn` 那几行 |
| 终端开机文字 | `js/main.js` | `bootSequence` 里的 `lines` 数组 |
| 底部跑马灯内容 | `index.html` | `marquee-inner` 里（改前半段，后半段是循环副本要同步改） |
| 全站霓虹配色 | `css/style.css` | 顶部 `:root` 里的 `--cyan` `--pink` `--violet` |
| 导航栏目名 | `js/main.js` | 顶部 `NAV` 数组 |
| 背景城市图 | 替换 `assets/img/hero-city.jpg`（同名覆盖即可） | — |
