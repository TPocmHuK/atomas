// Entry point: wires DOM, game state, renderer, and Yandex SDK together.

(function () {
  const canvas = document.getElementById('game');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const restartBtn = document.getElementById('restart');
  const modal = document.getElementById('modal');
  const finalScoreEl = document.getElementById('final-score');
  const newBestEl = document.getElementById('new-best');
  const continueBtn = document.getElementById('continue-btn');
  const replayBtn = document.getElementById('replay-btn');

  const renderer = new Renderer(canvas);
  let state = GameState.newGame();
  let best = 0;
  let movesSinceAd = 0;

  function resize() {
    const hud = document.getElementById('hud');
    const hudH = hud.getBoundingClientRect().height + 16;
    const hintH = 40;
    const w = window.innerWidth;
    const h = window.innerHeight - hudH - hintH;
    const size = Math.max(240, Math.min(w, h) - 16);
    renderer.resize(size);
    redraw();
  }

  function redraw() {
    renderer.layout(state);
    renderer.draw(state);
    scoreEl.textContent = String(state.score);
    bestEl.textContent = String(best);
  }

  function newGame() {
    state = GameState.newGame();
    movesSinceAd = 0;
    modal.classList.add('hidden');
    redraw();
  }

  async function onPlace(idx) {
    if (state.isGameOver) return;
    const ok = state.place(idx);
    if (!ok) return;
    redraw();
    movesSinceAd += 1;
    if (state.isGameOver) {
      await onGameOver();
    } else if (movesSinceAd >= 25) {
      movesSinceAd = 0;
      try { YSDK.showInterstitial(); } catch (_) {}
    }
  }

  async function onGameOver() {
    const isNewBest = state.score > best;
    if (isNewBest) {
      best = state.score;
      YSDK.saveBest(best);
      try { YSDK.submitScore('main', best); } catch (_) {}
    }
    finalScoreEl.textContent = String(state.score);
    newBestEl.classList.toggle('hidden', !isNewBest);
    continueBtn.disabled = false;
    continueBtn.style.display = '';
    modal.classList.remove('hidden');
    YSDK.gameplayStop();
    redraw();
    try { YSDK.showInterstitial(); } catch (_) {}
  }

  function onContinue() {
    if (!state.isGameOver) return;
    continueBtn.disabled = true;
    YSDK.showRewarded().then((rewarded) => {
      if (!rewarded) {
        continueBtn.disabled = false;
        return;
      }
      // Reward: clear half of the ring (largest atoms preserved at top).
      const keep = Math.ceil(state.ring.length / 2);
      const sorted = [...state.ring]
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => a !== 0)
        .sort((x, y) => y.a - x.a)
        .slice(0, keep)
        .sort((x, y) => x.i - y.i)
        .map(({ a }) => a);
      state.ring = sorted;
      modal.classList.add('hidden');
      continueBtn.style.display = 'none';
      YSDK.ready();
      redraw();
    });
  }

  function pointerToCanvas(e) {
    const rect = canvas.getBoundingClientRect();
    const t = (e.touches && e.touches[0]) ? e.touches[0] : e;
    return {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const { x, y } = pointerToCanvas(e);
    const idx = renderer.hitTest(x, y);
    if (idx != null) onPlace(idx);
  });

  // Avoid scrolling on touch.
  canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  restartBtn.addEventListener('click', () => {
    newGame();
    YSDK.ready();
  });
  replayBtn.addEventListener('click', () => {
    newGame();
    YSDK.ready();
  });
  continueBtn.addEventListener('click', onContinue);

  async function boot() {
    applyI18n('ru'); // default before SDK reports lang
    await YSDK.init();
    applyI18n(YSDK.lang || 'ru');
    best = await YSDK.loadBest();
    resize();
    YSDK.ready();
  }

  boot();
})();
