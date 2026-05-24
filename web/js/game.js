// Pure game logic for Atomas. No DOM/canvas references.

const CAPACITY = 18;
const PLUS = 0;

class GameState {
  constructor(opts = {}) {
    this.capacity = opts.capacity || CAPACITY;
    this.ring = opts.ring ? [...opts.ring] : [];
    this.next = (opts.next != null) ? opts.next : 1;
    this.score = opts.score || 0;
  }

  get isGameOver() {
    return this.ring.length >= this.capacity;
  }

  get maxElement() {
    let m = 1;
    for (const a of this.ring) if (a !== PLUS && a > m) m = a;
    return m;
  }

  static newGame() {
    const ring = [];
    for (let i = 0; i < 6; i++) ring.push(1 + Math.floor(Math.random() * 3));
    const s = new GameState({ ring });
    s.next = s._drawNext();
    return s;
  }

  _drawNext() {
    if (Math.floor(Math.random() * 5) === 0) return PLUS;
    const ceiling = Math.min(30, Math.max(2, this.maxElement + 2));
    return 1 + Math.floor(Math.random() * ceiling);
  }

  // Insert atom at the given slot (0..ring.length). For plus, fuses
  // matching neighbours outward greedily.
  place(insertIndex) {
    if (this.isGameOver) return false;
    if (this.ring.length >= this.capacity) return false;
    if (insertIndex < 0 || insertIndex > this.ring.length) return false;

    if (this.next === PLUS) {
      if (this.ring.length < 2) {
        this.next = this._drawNext();
        return true;
      }
      this.ring.splice(insertIndex, 0, PLUS);
      this._resolvePlusAt(insertIndex);
    } else {
      this.ring.splice(insertIndex, 0, this.next);
    }

    this.next = this._drawNext();
    return true;
  }

  _resolvePlusAt(plusIndex) {
    let idx = plusIndex;
    let streak = 0;
    while (true) {
      if (this.ring.length < 3) break;
      const n = this.ring.length;
      const leftIdx = (idx - 1 + n) % n;
      const rightIdx = (idx + 1) % n;
      if (leftIdx === rightIdx) break;
      const left = this.ring[leftIdx];
      const right = this.ring[rightIdx];
      if (left === PLUS || right === PLUS) break;
      if (left !== right) break;

      const fused = left + 1;
      streak += 1;
      this.score += fused * streak * 2;

      // Remove right, plus, left in descending order to keep indices valid.
      const indices = [leftIdx, idx, rightIdx].sort((a, b) => b - a);
      for (const i of indices) this.ring.splice(i, 1);
      const insertAt = indices[indices.length - 1];
      this.ring.splice(insertAt, 0, fused);
      idx = insertAt;
    }
  }
}
