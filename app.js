/* =========================================================================
   PoE_PatchNotes — logika strony
   ========================================================================= */
(function () {
  "use strict";

  var DATA = window.PATCH_DATA || { meta: {}, sections: [] };
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var ICON_COPY =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="11" height="11" rx="2"/>' +
    '<path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var ICON_OK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 6 9 17l-5-5"/></svg>';

  var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
  var esc = function (t) {
    return String(t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  var state = {
    hidden: { pl: false, en: false },
    focus: null,      // 'pl' | 'en' | null
    swapped: false
  };

  /* --------------------------------------------------------- budowa komórki */
  function cellHTML(lang, text, depth) {
    var t = (text == null || text === "") ? "—" : esc(text);
    return (
      '<td class="cell ' + lang + '" data-d="' + depth + '" data-lang="' + lang + '">' +
        '<div class="cell-inner"><span class="cell-text">' + t + "</span></div>" +
        '<button class="copy-btn" type="button" title="Kopiuj treść komórki" ' +
                'aria-label="Kopiuj treść komórki">' + ICON_COPY + "</button>" +
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

      var prevSub = true;
      sec.lines.forEach(function (ln, li) {
        var d = ln.d || 0;
        var isSub = !!ln.b;
        var cls = isSub ? ("subhead" + (li === 0 || prevSub === false ? "" : "")) : "";
        var trCls = isSub ? "subhead" : "";
        if (isSub && li === 0) trCls += " first";
        prevSub = isSub;
        html += '<tr class="' + trCls + '">' +
                  cellHTML("pl", ln.pl, d) +
                  cellHTML("en", ln.en, d) +
                "</tr>";
      });

      html += "</tbody></table></section>";
    });

    main.innerHTML = html || '<p style="color:var(--muted)">Brak danych — sprawdź data.js.</p>';
  }

  /* ------------------------------------------------------- spis treści + menu */
  function renderNav() {
    var toc = $("#tocList");
    var side = $("#sideList");
    var tocHtml = "", sideHtml = "";
    DATA.sections.forEach(function (sec) {
      tocHtml +=
        '<li><a href="#' + sec.id + '">' +
          '<span class="pl-t">' + esc(sec.title.pl) + "</span>" +
          '<span class="en-t">' + esc(sec.title.en) + "</span>" +
        "</a></li>";
      sideHtml += '<li><a href="#' + sec.id + '" title="' + esc(sec.title.pl) + '">' +
                  esc(sec.title.pl) + "</a></li>";
    });
    toc.innerHTML = tocHtml;
    side.innerHTML = sideHtml;
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

  /* --------------------------------------------------------- ukrywanie kolumn */
  function setHidden(col, hide) {
    var other = col === "pl" ? "en" : "pl";
    if (hide && state.hidden[other]) { // nie chowaj ostatniej widocznej kolumny
      setHidden(other, false);
    }
    state.hidden[col] = hide;
    document.body.classList.toggle("hide-" + col, hide);
    var btn = $('.toggle[data-col="' + col + '"]');
    if (btn) btn.classList.toggle("is-on", !hide);
    // jeśli wyróżniona kolumna została ukryta, wyczyść focus
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
    $$(".pn-table").forEach(function (tbl) {
      // colgroup
      var cg = tbl.querySelector("colgroup");
      if (cg && cg.children.length === 2) cg.insertBefore(cg.children[1], cg.children[0]);
      // wszystkie wiersze (thead + tbody)
      $$("tr", tbl).forEach(function (tr) {
        if (tr.children.length === 2) tr.insertBefore(tr.children[1], tr.children[0]);
      });
    });
    var btn = $("#swapBtn");
    if (btn) btn.classList.toggle("is-on", state.swapped);
  }

  /* -------------------------------------------------------------- scrollspy */
  function initScrollSpy() {
    var links = {};
    $$("#sideList a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var sections = $$(".pn-section");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var current = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) current = en.target.id;
      });
      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle("active", id === current);
      });
      var act = links[current];
      if (act && act.parentNode.parentNode) {
        var box = act.parentNode.parentNode; // ul -> div.side-inner
        var top = act.offsetTop - box.clientHeight / 2;
        if (top >= 0) box.scrollTop = top;
      }
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ----------------------------------------------------------------- zdarzenia */
  function bindEvents() {
    // kopiowanie (delegacja) + klik w kolumnę = focus
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
      // nie zmieniaj focusu, gdy użytkownik zaznacza tekst
      var sel = window.getSelection && window.getSelection();
      if (sel && String(sel).length > 0) return;
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

    // boczne menu (mobile)
    var sideNav = $("#sideNav"), sideToggle = $("#sideToggle");
    sideToggle.addEventListener("click", function () {
      var open = sideNav.classList.toggle("open");
      sideToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#sideList a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width:820px)").matches) {
          sideNav.classList.remove("open");
          sideToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

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
    var m = DATA.meta || {};
    renderNav();
    renderSections();
    bindEvents();
    initScrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
