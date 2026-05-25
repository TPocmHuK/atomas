// Minimal localization helper. Yandex Games supplies the user's language
// via ysdk.environment.i18n.lang; default to Russian.

const I18N = {
  ru: {
    score: 'Счёт',
    best: 'Рекорд',
    restart: 'Заново',
    hint: 'Коснитесь места между атомами',
    gameOver: 'Игра окончена',
    finalScore: 'Ваш счёт',
    newBest: 'Новый рекорд!',
    continueAd: 'Продолжить за рекламу',
    playAgain: 'Заново',
  },
  en: {
    score: 'Score',
    best: 'Best',
    restart: 'Restart',
    hint: 'Tap a slot between atoms',
    gameOver: 'Game Over',
    finalScore: 'Final score',
    newBest: 'New best!',
    continueAd: 'Continue (watch ad)',
    playAgain: 'Play again',
  },
  tr: {
    score: 'Skor',
    best: 'Rekor',
    restart: 'Yeniden',
    hint: 'Atomlar arasına dokunun',
    gameOver: 'Oyun bitti',
    finalScore: 'Skorunuz',
    newBest: 'Yeni rekor!',
    continueAd: 'Reklam izleyip devam et',
    playAgain: 'Tekrar oyna',
  },
};

function t(key, lang) {
  const dict = I18N[lang] || I18N.ru;
  return dict[key] || I18N.ru[key] || key;
}

function applyI18n(lang) {
  document.documentElement.lang = lang.startsWith('ru') ? 'ru' : lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, lang);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle, lang);
  });
}
