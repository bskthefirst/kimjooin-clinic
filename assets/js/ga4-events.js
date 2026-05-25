/* Conversion event tracking for Kim Joo-in clinic.
   Delegated click listener — works on every page and every link
   (current and future) without per-element wiring.
   Key conversions: phone_click, directions_click. */
(function () {
  if (window.__clinicGa4Events) return;
  window.__clinicGa4Events = true;

  function track(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(['event', name, params]);
    }
  }

  var lang = (document.documentElement.getAttribute('lang') || 'ko').toLowerCase();

  document.addEventListener('click', function (e) {
    var t = e.target;
    var a = t && t.closest ? t.closest('a[href]') : null;
    if (!a) return;

    var href = a.getAttribute('href') || '';
    var text = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);
    var base = {
      page_language: lang,
      page_path: location.pathname,
      link_url: href,
      link_text: text
    };

    if (href.indexOf('tel:') === 0) {
      track('phone_click', base);
      return;
    }
    if (/naver\.me|map\.naver|map\.kakao|maps\.google|goo\.gl\/maps|GuideView/i.test(href)) {
      track('directions_click', base);
      return;
    }
    if (/instagram\.com|youtube\.com|facebook\.com|pf\.kakao|blog\.naver/i.test(href)) {
      track('social_click', base);
      return;
    }
    if (/^\/(en|cn|jp)\.html$/.test(href) || /kimjooin\.com\/(en|cn|jp)\.html$/.test(href)) {
      track('language_switch', base);
      return;
    }
  }, true);
})();
