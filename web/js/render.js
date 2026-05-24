// Canvas renderer + hit testing for the atom ring.

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.max(1, window.devicePixelRatio || 1);
    this.size = 0;       // CSS pixel size (square)
    this.center = { x: 0, y: 0 };
    this.radius = 0;
    this.atomSize = 0;
    this.slotPositions = []; // [{x, y, index}]
    this.atomPositions = []; // [{x, y, atom}]
  }

  resize(cssSize) {
    this.size = cssSize;
    this.canvas.style.width = cssSize + 'px';
    this.canvas.style.height = cssSize + 'px';
    this.canvas.width = Math.round(cssSize * this.dpr);
    this.canvas.height = Math.round(cssSize * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.center = { x: cssSize / 2, y: cssSize / 2 };
    this.radius = cssSize * 0.38;
    this.atomSize = Math.max(28, Math.min(60, cssSize / 9));
  }

  layout(state) {
    this.slotPositions = [];
    this.atomPositions = [];
    const n = state.ring.length;
    if (n === 0) {
      this.slotPositions.push({ x: this.center.x, y: this.center.y, index: 0 });
      return;
    }
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      this.atomPositions.push({
        x: this.center.x + Math.cos(angle) * this.radius,
        y: this.center.y + Math.sin(angle) * this.radius,
        atom: state.ring[i],
      });
      const slotAngle = (Math.PI * 2 * (i + 0.5)) / n - Math.PI / 2;
      this.slotPositions.push({
        x: this.center.x + Math.cos(slotAngle) * this.radius,
        y: this.center.y + Math.sin(slotAngle) * this.radius,
        index: i + 1,
      });
    }
  }

  hitTest(x, y) {
    let best = null;
    let bestDist = Infinity;
    for (const slot of this.slotPositions) {
      const dx = x - slot.x;
      const dy = y - slot.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDist) {
        bestDist = d;
        best = slot;
      }
    }
    if (best && bestDist <= this.atomSize * 1.1) return best.index;
    return null;
  }

  draw(state) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);

    // Ring outline (subtle).
    if (state.ring.length > 0) {
      ctx.beginPath();
      ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Slots between atoms (clickable areas).
    for (const slot of this.slotPositions) {
      this._drawSlot(slot.x, slot.y, this.atomSize * 0.55);
    }

    // Ring atoms.
    for (const p of this.atomPositions) {
      this._drawAtom(p.x, p.y, this.atomSize, p.atom, false);
    }

    // Center "next" atom.
    this._drawAtom(this.center.x, this.center.y, this.atomSize, state.next, true);
  }

  _drawSlot(x, y, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  _drawAtom(x, y, size, atom, highlighted) {
    const ctx = this.ctx;
    const r = size / 2;
    const color = atomColor(atom);

    // Glow.
    ctx.beginPath();
    ctx.arc(x, y, r + (highlighted ? 6 : 3), 0, Math.PI * 2);
    ctx.fillStyle = this._withAlpha(color, highlighted ? 0.35 : 0.2);
    ctx.fill();

    // Body (radial gradient).
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, this._lighten(color, 0.35));
    g.addColorStop(1, color);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = highlighted ? 2.5 : 1;
    ctx.strokeStyle = highlighted ? '#ffffff' : 'rgba(0,0,0,0.25)';
    ctx.stroke();

    // Symbol.
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(size * 0.38)}px -apple-system, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(atomSymbol(atom), x, y + 1);
  }

  _withAlpha(hex, alpha) {
    const { r, g, b } = this._hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  _lighten(hex, t) {
    const { r, g, b } = this._hexToRgb(hex);
    const mix = (c) => Math.round(c + (255 - c) * t);
    return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
  }

  _hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  }
}
