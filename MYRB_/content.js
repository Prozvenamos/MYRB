const STYLE_ID = 'myrb-styles-block';

const cssRules = `
  ytd-browse[page-subtype="home"] #contents {
    display: none !important;
  }

  #secondary #related {
    display: none !important;
  }

  .ytp-endscreen-content {
    display: none !important;
  }
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
}

const headObserver = new MutationObserver(() => {
  if (!document.getElementById(STYLE_ID)) {
    injectStyles();
  }
});

const startupObserver = new MutationObserver(() => {
  if (document.head) {
    injectStyles();
    headObserver.observe(document.head, { childList: true });
    startupObserver.disconnect();
  }
});

startupObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});