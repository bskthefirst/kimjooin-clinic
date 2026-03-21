(function () {
  var DEFAULT_GA4_ID = 'G-XXXXXXXXXX';
  var id = '';

  if (typeof window.CLINIC_GA4_ID === 'string') {
    id = window.CLINIC_GA4_ID.trim();
  }
  if (!id) {
    id = DEFAULT_GA4_ID;
  }

  if (!/^G-[A-Z0-9]+$/i.test(id) || id === 'G-XXXXXXXXXX') {
    return;
  }

  if (window.__clinicGa4Initialized) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', id);

  var existing = document.querySelector('script[src*="www.googletagmanager.com/gtag/js?id="]');
  if (!existing) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }

  window.__clinicGa4Initialized = true;
})();
