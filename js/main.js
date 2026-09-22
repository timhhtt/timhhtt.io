/* ============================================================
   TIMHHTT · 暗物质裂隙
   全局交互：星空背景 / 闪电特效 / 晶体视差 / 导航 / 入场动画
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
   * 0. 导航注入 + 高亮
   * ---------------------------------------------------------- */
  var NAV = [
    { href: "index.html", cn: "首页" },
    { href: "projects.html", cn: "项目" },
    { href: "inspiration.html", cn: "灵感" },
    { href: "contact.html", cn: "联系" }
  ];

  function buildNav() {
    var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<a class="logo" href="index.html">' +
      '<span class="logo-mark">裂</span>' +
      '<span class="logo-text">TIMHHTT</span></a>' +
      '<nav class="top-nav" id="topNav">' +
      NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (current === n.href ? ' class="active"' : "") + ">" + n.cn + "</a>";
      }).join("") +
      "</nav>" +
      '<button id="menuToggle" aria-label="菜单">☰</button>';
    document.body.prepend(header);

    // 左侧竖排导航（仅首页，桌面端）
    var main = document.querySelector(".page-main");
    if (main && main.dataset.sidenav === "on") {
      var side = document.createElement("nav");
      side.className = "side-nav";
      side.innerHTML = NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (current === n.href ? ' class="active"' : "") + ">" + n.cn + "</a>";
      }).join("");
      document.body.appendChild(side);
    }

    // 移动端菜单
    var toggle = document.getElementById("menuToggle");
    var topNav = document.getElementById("topNav");
    if (toggle && topNav) {
      toggle.addEventListener("click", function () {
        topNav.classList.toggle("open");
      });
    }
  }

  /* ----------------------------------------------------------
   * 1. 页脚注入
   * ---------------------------------------------------------- */
  function buildFooter() {
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
      "暗物质裂隙 · TIMHHTT<span class='en'>DARK MATTER RIFT — BEYOND THE EVENT HORIZON</span>";
    document.body.appendChild(footer);
  }

  /* ----------------------------------------------------------
   * 2. 星空背景（全站共用 canvas，低开销）
   * ---------------------------------------------------------- */
  function startStarfield() {
    var canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var stars = [];
    var w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      stars = [];
      var count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1.1 + 0.2) * dpr,
          a: Math.random() * 0.55 + 0.1,
          tw: Math.random() * 0.02 + 0.004, // 闪烁速度
          ph: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.3 ? "190, 170, 255" : "200, 215, 255"
        });
      }
    }

    var t = 0;
    function draw() {
      t++;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + s.hue + "," + alpha.toFixed(3) + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    if (reduceMotion) {
      // 静态星空：画一帧
      ctx.clearRect(0, 0, w, h);
      stars.forEach(function (s) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + s.hue + "," + s.a + ")";
        ctx.fill();
      });
    } else {
      draw();
    }
  }

  /* ----------------------------------------------------------
   * 3. 闪电特效（仅首页，低频随机劈闪）
   * ---------------------------------------------------------- */
  function startLightning() {
    var canvas = document.getElementById("fxCanvas");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    var bolts = []; // 每条闪电：{segs, life, maxLife}
    var nextStrike = 60;

    function makeBolt() {
      var startX = (0.18 + Math.random() * 0.64) * w;
      var startY = (0.06 + Math.random() * 0.16) * h;
      var endY = startY + (0.24 + Math.random() * 0.3) * h;
      var segs = [];
      var x = startX, y = startY;
      var hue = Math.random() < 0.5 ? "150, 170, 255" : "190, 130, 255";
      segs.push([x, y]);
      while (y < endY) {
        y += (14 + Math.random() * 30) * dpr;
        x += (Math.random() - 0.5) * 60 * dpr;
        segs.push([x, y]);
      }
      // 生成 1~2 条分叉
      var branches = [];
      var bCount = 1 + (Math.random() < 0.5 ? 1 : 0);
      for (var b = 0; b < bCount; b++) {
        var idx = Math.floor(Math.random() * (segs.length - 4)) + 2;
        var bx = segs[idx][0], by = segs[idx][1];
        var bseg = [[bx, by]];
        var dir = Math.random() < 0.5 ? -1 : 1;
        for (var j = 0; j < 4 + Math.floor(Math.random() * 4); j++) {
          bx += dir * (10 + Math.random() * 26) * dpr;
          by += (10 + Math.random() * 22) * dpr;
          bseg.push([bx, by]);
        }
        branches.push(bseg);
      }
      bolts.push({ segs: segs, branches: branches, life: 1, decay: 0.06 + Math.random() * 0.04, hue: hue });
    }

    function strokePath(segs, alpha, hue, width, glow) {
      ctx.beginPath();
      ctx.moveTo(segs[0][0], segs[0][1]);
      for (var i = 1; i < segs.length; i++) ctx.lineTo(segs[i][0], segs[i][1]);
      ctx.strokeStyle = "rgba(" + hue + "," + alpha + ")";
      ctx.lineWidth = width * dpr;
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(" + hue + "," + Math.min(1, alpha + 0.2) + ")";
      ctx.shadowBlur = glow * dpr;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (--nextStrike <= 0) {
        makeBolt();
        nextStrike = 90 + Math.random() * 240; // 1.5s ~ 5.5s 一次
      }
      for (var i = bolts.length - 1; i >= 0; i--) {
        var b = bolts[i];
        b.life -= b.decay;
        if (b.life <= 0) { bolts.splice(i, 1); continue; }
        // 生命前 20% 更亮（主干爆发），带轻微抖闪
        var flicker = 0.75 + Math.random() * 0.25;
        var alpha = (b.life < 0.8 ? b.life : 1) * flicker;
        strokePath(b.segs, alpha * 0.95, b.hue, 1.6, 18);
        strokePath(b.segs, alpha * 0.35, b.hue, 4.5, 26); // 外辉光
        for (var k = 0; k < b.branches.length; k++) {
          strokePath(b.branches[k], alpha * 0.5, b.hue, 1, 10);
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ----------------------------------------------------------
   * 4. 晶体碎片层 + 鼠标视差（仅首页）
   * ---------------------------------------------------------- */
  function startShards() {
    var layer = document.querySelector(".shard-layer");
    if (!layer) return;

    var COUNT = window.innerWidth < 820 ? 7 : 14;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < COUNT; i++) {
      var s = document.createElement("span");
      s.className = "shard";
      var size = 8 + Math.random() * 26;
      s.style.width = size + "px";
      s.style.height = size * (1.2 + Math.random() * 0.6) + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--rot", Math.floor(Math.random() * 360) + "deg");
      s.style.setProperty("--dur", (7 + Math.random() * 8).toFixed(1) + "s");
      s.style.setProperty("--delay", (-Math.random() * 8).toFixed(1) + "s");
      s.dataset.depth = (Math.random() * 0.7 + 0.3).toFixed(2); // 视差深度
      frag.appendChild(s);
    }
    layer.appendChild(frag);

    if (reduceMotion) return;

    var shards = layer.querySelectorAll(".shard");
    var targetX = 0, targetY = 0, curX = 0, curY = 0;
    var heroBg = document.querySelector(".hero-bg");

    window.addEventListener("mousemove", function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 ~ 1
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    (function raf() {
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      shards.forEach(function (el) {
        var d = parseFloat(el.dataset.depth) * 26;
        var base = getComputedStyle(el).transform;
        el.style.translate = (-curX * d) + "px " + (-curY * d) + "px";
        void base; // float 动画保留在 transform，位移用独立 translate 属性
      });
      if (heroBg) {
        heroBg.style.transform = "scale(1.06) translate(" + (curX * -12) + "px, " + (curY * -8) + "px)";
      }
      requestAnimationFrame(raf);
    })();
  }

  /* ----------------------------------------------------------
   * 5. 滚动入场动画（reveal）
   * ---------------------------------------------------------- */
  function startReveal() {
    var els = document.querySelectorAll(".reveal, .project-card, .masonry-item");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
   * 6. 联系页打字机
   * ---------------------------------------------------------- */
  function startTyping() {
    var el = document.getElementById("typed");
    if (!el) return;
    var text = el.dataset.text || "";
    var i = 0;
    function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, 65 + Math.random() * 70);
      }
    }
    if (reduceMotion) { el.textContent = text; return; }
    setTimeout(tick, 700);
  }

  /* ----------------------------------------------------------
   * 启动
   * ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildNav();
    buildFooter();
    startStarfield();
    startLightning();
    startShards();
    startReveal();
    startTyping();
  });
})();
