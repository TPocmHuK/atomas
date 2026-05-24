// Thin wrapper around the Yandex Games SDK.
// All methods degrade gracefully when the SDK is unavailable (local dev).

const YSDK = {
  ysdk: null,
  player: null,
  leaderboards: null,
  lang: 'ru',
  inited: false,
  _lastInterstitial: 0,

  async init() {
    if (this.inited) return;
    this.inited = true;
    if (typeof YaGames === 'undefined') return;
    try {
      this.ysdk = await YaGames.init();
      try { this.lang = this.ysdk.environment.i18n.lang || 'ru'; } catch (_) {}
      try { this.leaderboards = await this.ysdk.getLeaderboards(); } catch (_) {}
      try {
        this.player = await this.ysdk.getPlayer({ scopes: false });
      } catch (_) {}
      try { this.ysdk.features.LoadingAPI?.ready(); } catch (_) {}
    } catch (e) {
      console.warn('YSDK init failed', e);
    }
  },

  ready() {
    try { this.ysdk?.features?.GameplayAPI?.start(); } catch (_) {}
  },

  gameplayStop() {
    try { this.ysdk?.features?.GameplayAPI?.stop(); } catch (_) {}
  },

  // Show a fullscreen interstitial. Throttled to once per ~60s so we
  // don't get rate-limited by Yandex.
  async showInterstitial() {
    if (!this.ysdk) return;
    const now = Date.now();
    if (now - this._lastInterstitial < 60_000) return;
    this._lastInterstitial = now;
    return new Promise((resolve) => {
      try {
        this.ysdk.adv.showFullscreenAdv({
          callbacks: {
            onClose: () => resolve(true),
            onError: () => resolve(false),
          },
        });
      } catch (_) {
        resolve(false);
      }
    });
  },

  // Show rewarded video. Resolves with true if the reward was granted.
  async showRewarded() {
    if (!this.ysdk) return false;
    return new Promise((resolve) => {
      let rewarded = false;
      try {
        this.ysdk.adv.showRewardedVideo({
          callbacks: {
            onRewarded: () => { rewarded = true; },
            onClose: () => resolve(rewarded),
            onError: () => resolve(false),
          },
        });
      } catch (_) {
        resolve(false);
      }
    });
  },

  async submitScore(boardName, score) {
    if (!this.leaderboards) return;
    try {
      await this.leaderboards.setLeaderboardScore(boardName, score);
    } catch (_) {}
  },

  // Persistent storage via the cloud (Player) if available, otherwise localStorage.
  async loadBest() {
    try {
      if (this.player) {
        const data = await this.player.getData(['best']);
        if (data && typeof data.best === 'number') return data.best;
      }
    } catch (_) {}
    const local = Number(localStorage.getItem('atomas:best') || 0);
    return isFinite(local) ? local : 0;
  },

  async saveBest(value) {
    try { localStorage.setItem('atomas:best', String(value)); } catch (_) {}
    try {
      if (this.player) await this.player.setData({ best: value }, true);
    } catch (_) {}
  },
};
