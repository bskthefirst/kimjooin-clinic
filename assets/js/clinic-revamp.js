(function () {
  var DEFAULT_GA4_ID = 'G-XXXXXXXXXX';
  var ga4Initialized = false;

  function getGa4Id() {
    var id = '';
    if (typeof window.CLINIC_GA4_ID === 'string') {
      id = window.CLINIC_GA4_ID.trim();
    }
    if (!id) {
      id = DEFAULT_GA4_ID;
    }
    return id;
  }

  function loadGa4() {
    var id = getGa4Id();
    var existing = document.querySelector('script[src*="www.googletagmanager.com/gtag/js?id="]');
    if (window.__clinicGa4Initialized || existing) {
      ga4Initialized = true;
      return;
    }
    if (ga4Initialized || !/^G-[A-Z0-9]+$/i.test(id) || id === 'G-XXXXXXXXXX') {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', id);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);

    ga4Initialized = true;
    window.__clinicGa4Initialized = true;
  }

  function sendGa4Event(eventName, params) {
    if (typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', eventName, params || {});
  }

  function isInWmuSlider(img) {
    var node = img;
    while (node) {
      if (node.className && typeof node.className === 'string' && node.className.indexOf('wmuSlider') !== -1) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  function optimizeImages() {
    var images = document.querySelectorAll('img');
    var i = 0;
    var heroMarked = false;

    for (i = 0; i < images.length; i++) {
      var img = images[i];
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');

      if (!heroMarked && isInWmuSlider(img)) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
        heroMarked = true;
      }
    }

    for (i = 0; i < Math.min(2, images.length); i++) {
      images[i].setAttribute('loading', 'eager');
    }
  }

  function rewriteLegacyAspLinks() {
    var anchors = document.querySelectorAll('a[href]');
    var i = 0;
    var fixed = {
      '/Module/Intro/AboutView.asp': '/Module/CMS/CMS_Srno_39849.html',
      '/Module/Intro/AboutView.html': '/Module/CMS/CMS_Srno_39849.html',
      '/Module/Intro/GuideView.asp': '/Module/Intro/GuideView.html',
      '/Module/Intro/EstView.asp': '/Module/Intro/EstView.html',
      '/Module/Intro/Sitemap.asp': '/Module/Intro/Sitemap.html',
      '/Module/News/News.asp': '/Module/News/News.html',
      '/Module/News/Lecture.asp': '/Module/News/Lecture.html',
      '/Module/Member/Login.asp': '/Module/Member/Login.html',
      '/Module/Member/PrivatePopUp.asp': '/Module/Member/PrivatePopUp.html',
      '/Module/Member/Member.asp?PState=write': '/Module/Member/Member_PState_write.html'
    };

    function convertHref(href) {
      var match = null;

      if (fixed[href]) {
        return fixed[href];
      }

      match = href.match(/^\/Module\/CMS\/CMS\.asp\?Srno=(\d+)$/i);
      if (match) {
        return '/Module/CMS/CMS_Srno_' + match[1] + '.html';
      }

      match = href.match(/^\/Module\/MBoard\/MBoard\.asp\?Gubun=(\d+)$/i);
      if (match) {
        return '/Module/MBoard/MBoard_Gubun_' + match[1] + '.html';
      }

      match = href.match(/^\/Module\/Intro\/EstView\.asp\?SrnoCheck=(\d+)$/i);
      if (match) {
        return '/Module/Intro/EstView_SrnoCheck_' + match[1] + '.html';
      }

      match = href.match(/^\/Module\/MBoard\/MBoard_View\.asp\?Gubun=(\d+)&Srno=(\d+)$/i);
      if (match) {
        return '/Module/MBoard/MBoard_Gubun_' + match[1] + '_Srno_' + match[2] + '.html';
      }

      if (href.indexOf('/external/') === 0 || href.indexOf('http://') === 0 || href.indexOf('https://') === 0) {
        return href;
      }

      if (href.indexOf('.asp') !== -1 && href.indexOf('?') === -1) {
        return href.replace(/\.asp$/i, '.html');
      }

      return href;
    }

    for (i = 0; i < anchors.length; i++) {
      var href = anchors[i].getAttribute('href');
      if (!href || href.indexOf('javascript:') === 0 || href.indexOf('#') === 0 || href.indexOf('tel:') === 0) {
        continue;
      }
      anchors[i].setAttribute('href', convertHref(href));
    }
  }

  function removeGreetingMenuItems() {
    var links = document.querySelectorAll('a');
    var i = 0;
    for (i = 0; i < links.length; i++) {
      var label = (links[i].textContent || '').replace(/\s+/g, '');
      if (label !== '인사말') {
        continue;
      }
      var link = links[i];
      var inDropdownContent = !!link.closest('.dropdown-content');
      var li = link.closest('li');

      // In top nav dropdowns, submenu anchors are direct children of .dropdown-content.
      // Removing closest <li> there would delete the whole top-level menu item.
      if (inDropdownContent) {
        link.remove();
        continue;
      }

      if (li && !li.classList.contains('dropdown')) {
        li.remove();
        continue;
      }

      link.remove();
    }
  }

  function removeMemberUi() {
    var memberLinks = document.querySelectorAll('a[href*="/Module/Member/"]');
    var i = 0;
    for (i = 0; i < memberLinks.length; i++) {
      var li = memberLinks[i].closest('li');
      memberLinks[i].remove();
      if (li && li.querySelectorAll('a').length === 0) {
        li.remove();
      }
    }

    document.querySelectorAll('.hero-intent a, .floating-booking a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('tel:') !== 0 && href.indexOf('https://naver.me/FG72nreF') !== 0) {
        link.remove();
      }
    });
  }

  function removeQuickMenu() {
    var quickMenu = document.querySelectorAll('.f5_quick');
    var i = 0;
    for (i = 0; i < quickMenu.length; i++) {
      quickMenu[i].remove();
    }
  }

  function removeCustomerCenterMenu() {
    var dropButtons = document.querySelectorAll('.gnb .dropbtn');
    var navTitles = document.querySelectorAll('.nav_title span');
    var allMenuColumns = document.querySelectorAll('#all_gnb .nav > li');
    var i = 0;

    for (i = 0; i < dropButtons.length; i++) {
      var label = (dropButtons[i].textContent || '').replace(/\s+/g, '');
      if (label !== '고객센터') {
        continue;
      }
      var li = dropButtons[i].closest('li');
      if (li) {
        li.remove();
      } else {
        dropButtons[i].remove();
      }
    }

    for (i = 0; i < navTitles.length; i++) {
      var title = (navTitles[i].textContent || '').replace(/\s+/g, '');
      if (title !== '고객센터') {
        continue;
      }
      var item = navTitles[i].closest('li');
      if (item) {
        item.remove();
      }
    }

    // Remove leftover customer center column in "all menu" panel.
    for (i = 0; i < allMenuColumns.length; i++) {
      var col = allMenuColumns[i];
      var titleNode = col.querySelector('.nav_title span');
      var title = titleNode ? (titleNode.textContent || '').replace(/\s+/g, '') : '';
      var hasBoardLink = !!col.querySelector('a[href*="/Module/MBoard/MBoard_Gubun_5"]');
      if (title === '고객센터' || hasBoardLink) {
        col.remove();
      }
    }
  }

  function ensurePageCtaStrip() {
    var existing = document.querySelector('.page-cta-strip');
    var subContents = document.querySelector('#sub_contents');
    var insertTarget = null;
    var strip = null;
    var html = '';

    if (existing) {
      return;
    }

    html += '<a class="cta-call" href="tel:051-802-7550">지금 전화예약</a>';
    html += '<a class="cta-directions" href="https://naver.me/FG72nreF" target="_blank" rel="noopener noreferrer">오시는 길</a>';
    html += '<a class="cta-exam" href="/Module/CMS/CMS_Srno_39855.html">검사 안내</a>';

    strip = document.createElement('div');
    strip.className = 'page-cta-strip';
    strip.innerHTML = html;

    if (subContents) {
      insertTarget = subContents.querySelector('.sub_head');
      if (insertTarget && insertTarget.parentNode) {
        insertTarget.parentNode.insertBefore(strip, insertTarget.nextSibling);
      } else {
        subContents.insertBefore(strip, subContents.firstChild);
      }
      return;
    }

    insertTarget = document.querySelector('.award-highlight') || document.querySelector('.contents_area_2') || document.querySelector('.contents');
    if (!insertTarget) {
      return;
    }
    if (insertTarget.parentNode) {
      insertTarget.parentNode.insertBefore(strip, insertTarget.nextSibling);
    }
  }

  function ensureFloatingButtons() {
    var wrappers = document.querySelectorAll('.floating-booking');
    var i = 0;

    for (i = 0; i < wrappers.length; i++) {
      var wrap = wrappers[i];
      var links = wrap.querySelectorAll('a');
      var j = 0;

      for (j = 0; j < links.length; j++) {
        var href = links[j].getAttribute('href') || '';
        if (links[j].classList.contains('cta-chat') || href.indexOf('/Module/Member/') !== -1) {
          links[j].remove();
        }
      }

      var callBtn = wrap.querySelector('a[href^="tel:"]');
      var dirBtn = wrap.querySelector('a.cta-directions');
      var instaBtn = wrap.querySelector('a.cta-instagram');

      if (!instaBtn) {
        instaBtn = document.createElement('a');
        instaBtn.className = 'cta-instagram';
        instaBtn.href = 'https://www.instagram.com/kimjooin_naegwa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
        instaBtn.target = '_blank';
        instaBtn.rel = 'noopener noreferrer';
        instaBtn.textContent = '공식 인스타';
      }

      if (!dirBtn) {
        dirBtn = document.createElement('a');
        dirBtn.className = 'cta-directions';
        dirBtn.href = 'https://naver.me/FG72nreF';
        dirBtn.target = '_blank';
        dirBtn.rel = 'noopener noreferrer';
        dirBtn.textContent = '오시는길';
      }

      if (callBtn) {
        wrap.insertBefore(instaBtn, callBtn);
        wrap.insertBefore(dirBtn, callBtn);
      } else {
        wrap.appendChild(instaBtn);
        wrap.appendChild(dirBtn);
      }
    }
  }

  function wireCtaTracking() {
    var selectors = '.floating-booking a, .page-cta-strip a, .revenue-intent a, .hero-intent a';
    var links = document.querySelectorAll(selectors);
    var i = 0;
    for (i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (event) {
        var href = event.currentTarget.getAttribute('href') || '';
        var key = 'clinic_cta_clicks_misc';
        var eventName = 'cta_misc_click';

        if (href.indexOf('tel:') === 0) {
          key = 'clinic_cta_clicks_phone';
          eventName = 'cta_phone_click';
        } else if (href.indexOf('naver.me/FG72nreF') !== -1) {
          key = 'clinic_cta_clicks_directions';
          eventName = 'cta_directions_click';
        } else if (href.indexOf('/Module/CMS/CMS_Srno_39855.html') === 0) {
          key = 'clinic_cta_clicks_exam';
          eventName = 'cta_exam_click';
        }

        var count = Number(window.localStorage.getItem(key) || 0) + 1;
        window.localStorage.setItem(key, String(count));
        sendGa4Event(eventName, {
          link_url: href,
          page_path: window.location.pathname,
          page_title: document.title
        });
      });
    }
  }

  function stabilizeAllMenuToggle() {}

  function initMotionEffects() {
    var targets = document.querySelectorAll(
      '.award-highlight, .contents_area_2, .contents_area_3, .contents_area_4, ' +
      '#sub_contents .sub_head, #sub_contents .sub_con_area, .news'
    );
    var i = 0;

    if (!targets.length) {
      return;
    }

    for (i = 0; i < targets.length; i++) {
      targets[i].classList.add('reveal-up');
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (i = 0; i < targets.length; i++) {
        targets[i].classList.add('is-visible');
      }
      return;
    }

    if (!('IntersectionObserver' in window)) {
      for (i = 0; i < targets.length; i++) {
        targets[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    for (i = 0; i < targets.length; i++) {
      observer.observe(targets[i]);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadGa4();
    optimizeImages();
    rewriteLegacyAspLinks();
    // Nav cleanup functions disabled — HTML already has clean 5-item nav
    // removeGreetingMenuItems();
    // removeCustomerCenterMenu();
    removeQuickMenu();
    // removeMemberUi();
    // ensurePageCtaStrip();
    ensureFloatingButtons();
    wireCtaTracking();
    initMotionEffects();
    stabilizeAllMenuToggle();

    // Mobile hamburger menu
    var hamburgerBtn = document.querySelector('.hamburger-btn');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.querySelector('.mobile-menu-close');

    if (hamburgerBtn && mobileMenu) {
      hamburgerBtn.addEventListener('click', function() {
        mobileMenu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (mobileClose && mobileMenu) {
      mobileClose.addEventListener('click', function() {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
    // Close on link click
    if (mobileMenu) {
      var mobileLinks = mobileMenu.querySelectorAll('a');
      for (var k = 0; k < mobileLinks.length; k++) {
        mobileLinks[k].addEventListener('click', function() {
          mobileMenu.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      }
    }
  });
})();
