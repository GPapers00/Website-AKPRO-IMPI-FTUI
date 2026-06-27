// js/navigation.js

export function initNavigation() {
  // ── Tab Navigation & Hash Routing Logic ───────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(targetTab, updateHistory = true) {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    const btn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
    if (btn) btn.classList.add('active');

    const targetPanel = document.getElementById(`panel-${targetTab}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    const youtubeIframe = document.querySelector('.about-us-video iframe');
    if (youtubeIframe) {
      if (targetTab === 'home') {
        youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }

    if (updateHistory) {
      const isLocal = window.location.protocol === 'file:';
      if (isLocal) {
        if (window.location.hash !== `#${targetTab}`) {
          window.history.pushState(null, null, `#${targetTab}`);
        }
      } else {
        if (window.location.pathname !== `/${targetTab}`) {
          window.history.pushState(null, null, `/${targetTab}`);
        }
      }
    }
  }

  function getCurrentTabFromUrl() {
    const isLocal = window.location.protocol === 'file:';
    if (isLocal) {
      return window.location.hash.replace('#', '');
    } else {
      let path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path === 'index.html' || !path) return '';
      return path;
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab, true);
    });
  });

  window.addEventListener('popstate', () => {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    let tab = getCurrentTabFromUrl();
    if (!tab) {
      tab = 'home';
    }
    switchTab(tab, false);
  });

  let initialTab = getCurrentTabFromUrl();
  if (initialTab) {
    switchTab(initialTab, false);
  } else {
    const isLocal = window.location.protocol === 'file:';
    window.history.replaceState(null, null, isLocal ? '#home' : '/home');
  }

  // ── Logo Navigation Logic ───────────────────────────────────
  const logoBtn = document.getElementById('logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('home', true);
    });
  }

  // ── Edit Icon Interaction (Mock Functionality) ──────────────
  const editIcons = document.querySelectorAll('.icon-edit');
  editIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      if (this.textContent === 'edit_square') {
        this.textContent = 'check_circle';
        this.style.color = 'var(--cerulean-blue)';
      } else {
        this.textContent = 'edit_square';
        this.style.color = '';
      }
    });
  });

  // ── Dynamic Sticky Headers Logic ───────────────────────────────
  const dynamicHeaders = document.querySelectorAll('.dynamic-header');
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 450) {
      dynamicHeaders.forEach(header => header.classList.add('hide-header'));
    } else {
      dynamicHeaders.forEach(header => header.classList.remove('hide-header'));
      if (currentScrollY > 100) {
        dynamicHeaders.forEach(header => header.classList.add('scrolled-style'));
      } else {
        dynamicHeaders.forEach(header => header.classList.remove('scrolled-style'));
      }
    }
  });

  // ── Mobile Menu Toggle Logic ─────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const headerTabs = document.getElementById('header__tabs');
  if (mobileMenuBtn && headerTabs) {
    mobileMenuBtn.addEventListener('click', () => {
      headerTabs.classList.toggle('menu-open');
      if (headerTabs.classList.contains('menu-open')) {
        mobileMenuBtn.textContent = 'close';
      } else {
        mobileMenuBtn.textContent = 'menu';
      }
    });

    const headerTabBtns = headerTabs.querySelectorAll('.tab-btn');
    headerTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        headerTabs.classList.remove('menu-open');
        mobileMenuBtn.textContent = 'menu';
      });
    });
  }
}
