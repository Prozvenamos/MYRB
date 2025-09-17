const STYLE_ID = 'myrb-styles-block';
const cssRules = `
  ytd-browse[page-subtype="home"] #contents { display: none !important; }
  #secondary #related { display: none !important; }
  .ytp-endscreen-content { display: none !important; }

  .html5-video-player.ad-showing .html5-video-container {
    visibility: hidden !important;
  }
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
}

const AD_PLAYER_CLASS = 'ad-showing';
const VIDEO_PLAYER_SELECTOR = '.html5-video-player';
let notificationSound = null;
let originalVolume = { volume: 1, muted: false };
let isAdPlaying = false;

function initializeAudio() {
    if (!notificationSound) {
        try {
            const soundURL = chrome.runtime.getURL('not.mp3');
            notificationSound = new Audio(soundURL);
            notificationSound.loop = true;
        } catch (e) {
            console.error("MYRB: Error loading not.mp3. Make sure the file is listed in web_accessible_resources in manifest.json", e);
        }
    }
}

function stopNotificationSound() {
    if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        isAdPlaying = false;
    }
}

function observePlayer(playerNode) {
    if (playerNode.dataset.myrbObserverAttached) return;
    playerNode.dataset.myrbObserverAttached = 'true';

    const adObserver = new MutationObserver(() => {
        const isAdShowing = playerNode.classList.contains(AD_PLAYER_CLASS);
        const video = playerNode.querySelector('video');

        if (isAdShowing) {
            if (!video.muted) {
                originalVolume = { volume: video.volume, muted: video.muted };
                video.muted = true;
                if (notificationSound && !isAdPlaying) {
                    notificationSound.currentTime = 0;
                    notificationSound.play().catch(e => console.warn("MYRB: Sound play failed:", e));
                    isAdPlaying = true;
                }
            }
        } else {
            if (isAdPlaying) {
                stopNotificationSound();
            }
            if (originalVolume.muted === false && video.muted === true) {
                video.muted = false;
                video.volume = originalVolume.volume;
            }
        }
    });

    adObserver.observe(playerNode, {
        attributes: true,
        attributeFilter: ['class']
    });
}

function initialize() {
    if (document.head) {
        injectStyles();
    } else {
        const startupObserver = new MutationObserver(() => {
            if (document.head) {
                injectStyles();
                startupObserver.disconnect();
            }
        });
        startupObserver.observe(document.documentElement, { childList: true });
    }

    initializeAudio();

    const bodyObserver = new MutationObserver(() => {
        const playerNode = document.querySelector(VIDEO_PLAYER_SELECTOR);
        if (playerNode) {
            observePlayer(playerNode);
        }
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}