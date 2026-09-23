/* ============================================================
   TIMHHTT · NEON CITY
   全局交互：终端开机 / 导航 / 转场 / 鼠标光晕 / Glitch / 氛围层
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 820px)").matches;

  /* ----------------------------------------------------------
   * 0. 导航数据
   * ---------------------------------------------------------- */
  var NAV = [
    { href: "index.html", cn: "首页" },
    { href: "profile.html", cn: "档案" },
    { href: "projects.html", cn: "项目" },
    { href: "gallery.html", cn: "画廊" },
    { href: "contact.html", cn: "联系" }
  ];

  function currentPage() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  /* ----------------------------------------------------------
   * 1. 导航 + 页脚 + 氛围层注入
   * ---------------------------------------------------------- */
  function buildChrome() {
    var cur = currentPage();

    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<a class="logo" href="index.html">' +
      '<span class="logo-mark">T</span>' +
      '<span class="logo-text">TIMHHTT<em>_</em></span></a>' +
      '<nav class="top-nav" id="topNav">' +
      NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (cur === n.href ? ' class="active"' : "") + ">" + n.cn + "</a>";
      }).join("") +
      "</nav>" +
      '<div class="nav-status"><span class="dot"></span><span>SYS.ONLINE</span><span id="navClock"></span></div>' +
      '<button id="menuToggle" aria-label="菜单">≡</button>';
    document.body.prepend(header);

    var toggle = document.getElementById("menuToggle");
    var topNav = document.getElementById("topNav");
    if (toggle && topNav) {
      toggle.addEventListener("click", function () {
        topNav.classList.toggle("open");
      });
    }

    // 时钟
    var clock = document.getElementById("navClock");
    if (clock) {
      var tick = function () {
        var d = new Date();
        var p = function (n) { return String(n).padStart(2, "0"); };
        clock.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
      };
      tick();
      setInterval(tick, 1000);
    }

    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
      '© 2026 <span class="c">TIMHHTT</span> · <span class="p">NEON CITY</span>' +
      "<span class='en'>SIGNAL LOST SOMEWHERE BETWEEN THE RAIN AND THE LIGHT</span>";
    document.body.appendChild(footer);

    // 氛围层
    ["crt-lines", "noise", "vignette"].forEach(function (cls) {
      var d = document.createElement("div");
      d.className = cls;
      d.setAttribute("aria-hidden", "true");
      document.body.appendChild(d);
    });
  }

  /* ----------------------------------------------------------
   * 2. 终端开机（仅首页；sessionStorage 记忆，可点击跳过）
   * ---------------------------------------------------------- */
  function bootSequence(done) {
    var boot = document.getElementById("boot");
    if (!boot) { done(); return; }

    if (reduceMotion || sessionStorage.getItem("booted")) {
      boot.remove();
      done();
      return;
    }

    var lines = [
      '> NEON CITY BIOS v2.6.3 ................ <span class="ok">OK</span>',
      '> 神经链路检测 ........................ <span class="ok">OK</span>',
      '> 记忆体完整性校验 .................... <span class="ok">98.7%</span>',
      '> 城市网格接入 ........................ <span class="ok">ONLINE</span>',
      '> 天气系统: <span class="warn">酸雨 · 强度 67%</span>',
      '> 霓虹指数: <span class="warn">爆表</span>',
      '> 身份验证: <span class="dim">TIMHHTT</span> ........... <span class="ok">已确认</span>',
      '> 正在唤醒主视觉系统 .................. <span class="ok">READY</span>',
      '',
      '> <span class="ok">欢迎回来。</span>'
    ];

    var inner = boot.querySelector(".boot-inner");
    var skip = boot.querySelector(".boot-skip");
    var idx = 0;
    var timer;

    function finish() {
      clearTimeout(timer);
      boot.classList.add("boot-out");
      sessionStorage.setItem("booted", "1");
      setTimeout(function () { boot.remove(); done(); }, 480);
    }

    function nextLine() {
      if (idx >= lines.length) { timer = setTimeout(finish, 700); return; }
      var div = document.createElement("div");
      div.className = "boot-line";
      div.innerHTML = lines[idx] || "&nbsp;";
      inner.appendChild(div);
      requestAnimationFrame(function () { div.classList.add("show"); });
      idx++;
      timer = setTimeout(nextLine, idx > 8 ? 420 : 150 + Math.random() * 200);
    }

    skip.addEventListener("click", finish);
    boot.addEventListener("click", function (e) {
      if (e.target === boot || e.target === inner) finish();
    });
    nextLine();
  }

  /* ----------------------------------------------------------
   * 3. 星空（极淡，青粉双色）
   * ---------------------------------------------------------- */
  function startStarfield() {
    var canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var stars = [], w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      stars = [];
      var count = Math.floor((window.innerWidth * window.innerHeight) / 14000);
      for (var i = 0; i < count; i++) {
        var roll = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.random() * 1 + 0.3) * dpr,
          a: Math.random() * 0.4 + 0.08,
          tw: Math.random() * 0.02 + 0.004,
          ph: Math.random() * Math.PI * 2,
          hue: roll < 0.12 ? "255, 45, 149" : roll < 0.4 ? "0, 240, 255" : "210, 220, 255"
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
   * 4. 鼠标跟随光晕（仅桌面端）
   * ---------------------------------------------------------- */
  function startGlowCursor() {
    if (isMobile || reduceMotion) return;
    var glow = document.createElement("div");
    glow.id = "glowCursor";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty;
    window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });

    (function raf() {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(raf);
    })();
  }

  /* ----------------------------------------------------------
   * 5. Glitch 标题（随机触发）
   * ---------------------------------------------------------- */
  function startGlitch() {
    var titles = document.querySelectorAll(".glitch");
    if (!titles.length || reduceMotion) return;

    function strike(el) {
      el.classList.add("glitching");
      setTimeout(function () { el.classList.remove("glitching"); }, 340);
    }

    titles.forEach(function (el) {
      el.setAttribute("data-text", el.textContent);
      (function loop() {
        setTimeout(function () {
          strike(el);
          if (Math.random() < 0.3) setTimeout(function () { strike(el); }, 420);
          loop();
        }, 2600 + Math.random() * 4200);
      })();
    });
  }

  /* ----------------------------------------------------------
   * 6. 首页主视觉鼠标视差（轻量）
   * ---------------------------------------------------------- */
  function startHeroParallax() {
    var bg = document.querySelector(".hero-bg");
    if (!bg || isMobile || reduceMotion) return;
    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    (function raf() {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      bg.style.transform = "translate(" + (cx * -14) + "px," + (cy * -9) + "px) scale(1.02)";
      requestAnimationFrame(raf);
    })();
  }

  /* ----------------------------------------------------------
   * 7. 滚动入场 + 技能条充能
   * ---------------------------------------------------------- */
  function startReveal() {
    var els = document.querySelectorAll(".reveal");
    var fills = document.querySelectorAll(".skill .s-fill");

    function showAll() {
      els.forEach(function (el) { el.classList.add("visible"); });
      fills.forEach(function (f) { f.style.width = f.dataset.level + "%"; });
    }

    if (!("IntersectionObserver" in window) || reduceMotion) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        if (en.target.classList.contains("skill-block") || en.target.querySelector(".s-fill")) {
          en.target.querySelectorAll(".s-fill").forEach(function (f) {
            setTimeout(function () { f.style.width = f.dataset.level + "%"; }, 250);
          });
        }
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
   * 8. 项目卡片 3D 倾斜（仅桌面端）
   * ---------------------------------------------------------- */
  function startCardTilt() {
    if (isMobile || reduceMotion) return;
    document.querySelectorAll(".project-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (px * 7) + "deg) rotateX(" + (-py * 7) + "deg) translateY(-5px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ----------------------------------------------------------
   * 9. 打字机（联系页）
   * ---------------------------------------------------------- */
  function startTyping() {
    var el = document.getElementById("typed");
    if (!el) return;
    var text = el.dataset.text || "";
    if (reduceMotion) { el.textContent = text; return; }
    var i = 0;
    (function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, 60 + Math.random() * 75);
      }
    })();
  }

  /* ----------------------------------------------------------
   * 10. 页面转场（拦截站内链接）
   * ---------------------------------------------------------- */
  function startTransitions() {
    if (reduceMotion) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || a.target === "_blank" || href.indexOf("#") === 0) return;
      if (!/\.html($|#)/.test(href)) return;
      e.preventDefault();
      document.body.classList.add("page-exit");
      setTimeout(function () { location.href = href; }, 210);
    });
  }

  /* ----------------------------------------------------------
   * 启动
   * ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    startStarfield();
    startGlowCursor();
    startGlitch();
    startHeroParallax();
    startTransitions();

    bootSequence(function () {
      startReveal();
      startCardTilt();
      startTyping();
    });
  });
})();
