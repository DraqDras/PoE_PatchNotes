/* =========================================================================
   PoE_PatchNotes — logika strony
   ========================================================================= */
(function () {
  "use strict";

  var DATA = window.PATCH_DATA || { meta: {}, sections: [] };
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------ ikony (SVG) */
  var ICON_COPY =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="11" height="11" rx="2"/>' +
    '<path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var ICON_OK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 6 9 17l-5-5"/></svg>';
  var ICON_EYE =
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
    '<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>' +
    '<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>';
  var ICON_EYE_SLASH =
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
    '<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>' +
    '<path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829z"/>' +
    '<path d="M13.646 14.354 1.646 2.354l.708-.708 12 12z"/></svg>';
  var ICON_ARROWS =
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
    '<path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>';
  var ICON_CHECK =
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
    '<path d="M13.485 1.929a.75.75 0 0 1 .086 1.056l-6.5 8a.75.75 0 0 1-1.13.062l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.905 2.904 5.97-7.348a.75.75 0 0 1 1.06-.086z"/></svg>';

  var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
  var esc = function (t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  var state = {
    hidden: { pl: false, en: false },
    focus: "pl",        // domyślnie wyróżniona kolumna polska
    swapped: false,
    marked: new Set()   // klucze oznaczonych komórek
  };

  /* --------------------------------------------------------------- cookies */
  function setCookie(name, val, days) {
    var exp = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + encodeURIComponent(val) + "; Expires=" + exp + "; Path=/; SameSite=Lax";
  }
  function getCookie(name) {
    var m = document.cookie.match("(?:^|; )" + name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1") + "=([^;]*)");
    return m ? decodeURIComponent(m[1]) : null;
  }
  function loadMarks() {
    var raw = getCookie("pn_marks");
    state.marked = new Set(raw ? raw.split(",").filter(Boolean) : []);
  }
  function persistMarks() {
    setCookie("pn_marks", Array.prototype.join.call(Array.from(state.marked), ","), 365);
  }

  /* --------------------------------------------------------- budowa komórki */
  function cellHTML(lang, text, depth, key, marked) {
    var t = (text == null || text === "") ? "—" : esc(text);
    return (
      '<td class="cell ' + lang + (marked ? " marked" : "") + '" data-d="' + depth +
          '" data-lang="' + lang + '" data-key="' + key + '">' +
        '<div class="cell-inner"><span class="cell-text">' + t + "</span></div>" +
        '<button class="copy-btn" type="button" title="Kopiuj treść komórki" ' +
                'aria-label="Kopiuj treść komórki">' + ICON_COPY + "</button>" +
        '<button class="mark-chk" type="button" role="checkbox" aria-checked="' + (marked ? "true" : "false") +
                '" title="Oznacz komórkę jako ważną" aria-label="Oznacz komórkę jako ważną">' +
          '<span class="box">' + ICON_CHECK + "</span></button>" +
      "</td>"
    );
  }

  /* -------------------------------------------------------- render sekcji */
  function renderSections() {
    var main = $("#content");
    var html = "";

    DATA.sections.forEach(function (sec, si) {
      var num = pad2(si + 1);
      html += '<section class="pn-section" id="' + sec.id + '">';
      html +=
        "<h2>" +
          '<span class="sec-num">' + num + "</span> " +
          '<span class="pl-title">' + esc(sec.title.pl) + "</span> " +
          '<span class="en-title">' + esc(sec.title.en) + "</span>" +
          '<a class="sec-head-link" href="#' + sec.id + '" aria-label="Odnośnik do sekcji">#</a>' +
        "</h2>";

      html += '<table class="pn-table">';
      html += '<colgroup><col class="c-pl"><col class="c-en"></colgroup>';
      html +=
        "<thead><tr>" +
          '<th class="pl" data-lang="pl"><span class="lang-dot"></span>Polski' +
            '<span class="th-hint">tłumaczenie</span></th>' +
          '<th class="en" data-lang="en"><span class="lang-dot"></span>English' +
            '<span class="th-hint">oryginał</span></th>' +
        "</tr></thead><tbody>";

      sec.lines.forEach(function (ln, li) {
        var d = ln.d || 0;
        var isSub = !!ln.b;
        var trCls = isSub ? "subhead" : "";
        if (isSub && li === 0) trCls += " first";
        var kp = si + "." + li + ".p", ke = si + "." + li + ".e";
        html += '<tr class="' + trCls + '">' +
                  cellHTML("pl", ln.pl, d, kp, state.marked.has(kp)) +
                  cellHTML("en", ln.en, d, ke, state.marked.has(ke)) +
                "</tr>";
      });

      html += "</tbody></table></section>";
    });

    main.innerHTML = html || '<p style="color:var(--muted)">Brak danych — sprawdź data.js.</p>';
  }

  /* ------------------------------------------- spis treści (tabela) + menu */
  function renderNav() {
    var tocHtml =
      '<table class="toc-table"><colgroup><col class="c-pl"><col class="c-en"></colgroup>' +
      '<thead><tr><th class="pl">Polski</th><th class="en">English</th></tr></thead><tbody>';
    var sideHtml = "";
    DATA.sections.forEach(function (sec, i) {
      var num = pad2(i + 1);
      tocHtml +=
        '<tr class="toc-row" data-target="' + sec.id + '" tabindex="0" role="link" ' +
            'aria-label="Przejdź do sekcji: ' + esc(sec.title.pl) + '">' +
          '<td class="pl"><span class="toc-num">' + num + "</span>" + esc(sec.title.pl) + "</td>" +
          '<td class="en">' + esc(sec.title.en) + "</td>" +
        "</tr>";
      sideHtml += '<li><a href="#' + sec.id + '" title="' + esc(sec.title.pl) + '">' +
                  esc(sec.title.pl) + "</a></li>";
    });
    tocHtml += "</tbody></table>";
    $("#tocList").innerHTML = tocHtml;
    $("#sideList").innerHTML = sideHtml;
  }

  function goToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    else location.hash = id;
  }

  /* ------------------------------------------------------------- kopiowanie */
  function copyText(text, btn) {
    var done = function () {
      btn.classList.add("copied");
      btn.innerHTML = ICON_OK;
      showToast("Skopiowano do schowka");
      setTimeout(function () {
        btn.classList.remove("copied");
        btn.innerHTML = ICON_COPY;
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  var toastTimer;
  function showToast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1400);
  }

  /* ----------------------------------------------- oznaczanie komórek */
  function toggleMark(btn) {
    var cell = btn.closest(".cell");
    if (!cell) return;
    var key = cell.getAttribute("data-key");
    var on = btn.getAttribute("aria-checked") !== "true";
    btn.setAttribute("aria-checked", on ? "true" : "false");
    cell.classList.toggle("marked", on);
    if (on) state.marked.add(key); else state.marked.delete(key);
    persistMarks();
  }

  /* --------------------------------------------------------- ukrywanie kolumn */
  function updateEye(col) {
    var btn = $('.toggle[data-col="' + col + '"]');
    if (!btn) return;
    var ico = btn.querySelector(".ico");
    if (ico) ico.innerHTML = state.hidden[col] ? ICON_EYE_SLASH : ICON_EYE;
  }
  function setHidden(col, hide) {
    var other = col === "pl" ? "en" : "pl";
    if (hide && state.hidden[other]) setHidden(other, false); // zawsze zostaw jedną kolumnę
    state.hidden[col] = hide;
    document.body.classList.toggle("hide-" + col, hide);
    var btn = $('.toggle[data-col="' + col + '"]');
    if (btn) btn.classList.toggle("is-on", !hide);
    updateEye(col);
    if (hide && state.focus === col) setFocus(null);
  }

  /* ----------------------------------------------------------- focus kolumny */
  function setFocus(col) {
    state.focus = col;
    document.body.classList.remove("focus-pl", "focus-en");
    if (col) document.body.classList.add("focus-" + col);
    $$(".pn-table thead th").forEach(function (th) {
      th.classList.toggle("col-focused", !!col && th.getAttribute("data-lang") === col);
    });
    var clr = $("#clearFocusBtn");
    if (clr) clr.hidden = !col;
  }

  function columnFromEvent(e) {
    var cell = e.target.closest("[data-lang]");
    return cell ? cell.getAttribute("data-lang") : null;
  }

  /* ------------------------------------------------------------ zamiana kolumn */
  function swapColumns() {
    state.swapped = !state.swapped;
    $$(".pn-table, .toc-table").forEach(function (tbl) {
      var cg = tbl.querySelector("colgroup");
      if (cg && cg.children.length === 2) cg.insertBefore(cg.children[1], cg.children[0]);
      $$("tr", tbl).forEach(function (tr) {
        if (tr.children.length === 2) tr.insertBefore(tr.children[1], tr.children[0]);
      });
    });
    var btn = $("#swapBtn");
    if (btn) btn.classList.toggle("is-on", state.swapped);
  }

  /* ---------------------------------------------------- zwijanie menu sekcji */
  function setSideCollapsed(collapsed) {
    var nav = $("#sideNav");
    nav.classList.toggle("collapsed", collapsed);
    document.body.classList.toggle("side-collapsed", collapsed);
    var title = $("#sideTitle");
    if (title) title.setAttribute("aria-expanded", collapsed ? "false" : "true");
  }

  /* -------------------------------------------------------------- scrollspy */
  function initScrollSpy() {
    var links = {};
    $$("#sideList a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var sections = $$(".pn-section");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var current = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) current = en.target.id; });
      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle("active", id === current);
      });
      var act = links[current];
      if (act && act.parentNode.parentNode) {
        var box = act.parentNode.parentNode;
        var top = act.offsetTop - box.clientHeight / 2;
        if (top >= 0) box.scrollTop = top;
      }
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ----------------------------------------------------- pasek cookie */
  function initCookieBar() {
    var bar = $("#cookieBar");
    if (!bar) return;
    if (getCookie("pn_cookie_ack") === "1") { bar.hidden = true; return; }
    bar.hidden = false;
    $("#cookieOk").addEventListener("click", function () {
      setCookie("pn_cookie_ack", "1", 365);
      bar.hidden = true;
    });
  }

  /* ----------------------------------------------------------------- zdarzenia */
  function bindEvents() {
    var main = $("#content");
    main.addEventListener("click", function (e) {
      var cbtn = e.target.closest(".copy-btn");
      if (cbtn) {
        e.stopPropagation();
        var cell = cbtn.closest(".cell");
        var txt = cell ? cell.querySelector(".cell-text").textContent : "";
        copyText(txt, cbtn);
        return;
      }
      var mbtn = e.target.closest(".mark-chk");
      if (mbtn) { e.stopPropagation(); toggleMark(mbtn); return; }

      var sel = window.getSelection && window.getSelection();
      if (sel && String(sel).length > 0) return; // nie zmieniaj focusu przy zaznaczaniu
      var col = columnFromEvent(e);
      if (col) setFocus(state.focus === col ? null : col);
    });

    // przełączniki widoczności kolumn
    $$(".toggle[data-col]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var col = btn.getAttribute("data-col");
        setHidden(col, !state.hidden[col]);
      });
    });

    $("#swapBtn").addEventListener("click", swapColumns);
    $("#clearFocusBtn").addEventListener("click", function () { setFocus(null); });

    // spis treści — klik / klawiatura w dowolnym wierszu
    var toc = $("#tocList");
    toc.addEventListener("click", function (e) {
      var row = e.target.closest(".toc-row");
      if (row) goToSection(row.getAttribute("data-target"));
    });
    toc.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        var row = e.target.closest(".toc-row");
        if (row) { e.preventDefault(); goToSection(row.getAttribute("data-target")); }
      }
    });

    // zwijanie / rozwijanie menu sekcji
    $("#sideTitle").addEventListener("click", function () { setSideCollapsed(true); });
    $("#sideExpandBtn").addEventListener("click", function () { setSideCollapsed(false); });

    // na górę
    var toTop = $("#toTop");
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.pageYOffset > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------- init */
  function init() {
    loadMarks();
    renderNav();
    renderSections();
    bindEvents();
    initScrollSpy();

    updateEye("pl"); updateEye("en");
    $("#sideExpandBtn").innerHTML = ICON_ARROWS;
    $(".side-arrow").innerHTML = ICON_ARROWS;

    setFocus("pl"); // domyślny focus na polskim
    if (window.matchMedia("(max-width:820px)").matches) setSideCollapsed(true);
    initCookieBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
