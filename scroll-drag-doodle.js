/* 
 * SCROLL-DRIVEN HORIZONTAL DRAG TEXT ANIMATION WITH DOODLE STICKERS (PRD v5 Implementation)
 * Dependency-free, Vanilla JS/CSS Scroll-Driven Horizontal Drag & Letter Wobble
 */

class ScrollDragDoodleComponent {
  constructor(options = {}) {
    this.config = {
      containerId: options.containerId || 'scroll-drag-doodle-container',
      sentence: options.sentence || "How our hybrid cipher layers three distinct cryptographic primitives",
      autoDistribute: options.autoDistribute !== undefined ? options.autoDistribute : true,
      frequency: options.frequency || 0.9,
      amplitude: options.amplitude || 10,
      phaseSpeed: options.phaseSpeed || 14,
      endBufferRatio: options.endBufferRatio || 0.35,
      lerpFactor: options.lerpFactor || 0.12,
    };

    // Source doodle SVG library with -15% reduced sizes (§7 spec) including Framer Shape 1 vectors
    const framerShape1Svg = `<svg viewBox="0 0 42 21" fill="currentColor"><path d="M 41.99 21 L 32.449 21 C 32.449 14.672 27.318 9.551 21 9.551 C 14.682 9.551 9.551 14.682 9.551 21 L 0 21 C 0 9.403 9.403 0 21 0 C 32.597 0 42 9.403 42 21 Z"/></svg>`;

    this.doodleLibrary = [
      { type: 'framer-arch-green', size: 68, color: '#C8E24C', svg: framerShape1Svg },
      { type: 'sparkle', size: 22, color: '#E85D6B', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6"/></svg>` },
      { type: 'framer-arch-pink', size: 56, color: '#E85D6B', svg: framerShape1Svg },
      { type: 'squiggle', size: 60, color: '#C8E24C', svg: `<svg viewBox="0 0 70 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M4 10 Q 15 2, 26 10 T 48 10 T 66 10"/></svg>` },
      { type: 'heart', size: 29, color: '#E85D6B', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` },
      { type: 'framer-arch-purple', size: 74, color: '#A9A3E8', svg: framerShape1Svg },
      { type: 'thumb', size: 48, color: '#EFA13B', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 10v11d0 0h10a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3h-4.63l.93-4.46.03-.32a1.5 1.5 0 0 0-.44-1.06L13 2 7.59 7.41A2 2 0 0 0 7 8.83V10z"/></svg>` },
      { type: 'framer-arch-orange', size: 60, color: '#EFA13B', svg: framerShape1Svg },
      { type: 'arc', size: 170, color: '#A9A3E8', svg: `<svg viewBox="0 0 200 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M10 30 Q 100 -10, 190 30"/></svg>` },
      { type: 'star', size: 26, color: '#EFA13B', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
      { type: 'framer-arch-blue', size: 64, color: '#56CCF2', svg: framerShape1Svg },
      { type: 'zigzag', size: 51, color: '#16130F', svg: `<svg viewBox="0 0 60 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M4 16 L 16 4 L 28 16 L 40 4 L 52 16"/></svg>` },
      { type: 'runner', size: 39, color: '#C8E24C', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="14" cy="4" r="2"/><path d="M10 21l3-6 4 2"/><path d="M6 13l4-2 3 3"/><path d="M17 9l-4 1-2-3"/></svg>` },
      { type: 'hand', size: 54, color: '#EFA13B', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V2a2 2 0 0 0-4 0v9M6 14v-2a2 2 0 0 0-4 0v5a7 7 0 0 0 14 0v-3"/></svg>` },
      { type: 'lightning', size: 22, color: '#E85D6B', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
      { type: 'spiral', size: 31, color: '#A9A3E8', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 12 a 2 2 0 0 1 2 2 a 4 4 0 0 1 -4 4 a 6 6 0 0 1 -6 -6 a 8 8 0 0 1 8 -8 a 10 10 0 0 1 10 10"/></svg>` },
      { type: 'sunglasses', size: 48, color: '#16130F', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M2 10h20M4 10l2 6h4l2-6M12 10l2 6h4l2-6"/></svg>` },
    ];

    this.state = {
      targetProgress: 0,
      currentProgress: 0,
      maxDragDistance: 0,
      spacerHeight: 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pinState: 'before', // 'before' | 'pinned' | 'after'
      letterSpans: [],
      wordNodes: [],
      doodleElements: [],
    };

    this.init();
  }

  init() {
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) return;

    this.buildDOM();
    this.recalculateLayout();
    this.bindEvents();
    this.startAnimationLoop();
  }

  buildDOM() {
    this.container.innerHTML = `
      <div class="scroll-drag-spacer">
        <div class="scroll-drag-track-wrapper pin-before">
          <div class="scroll-drag-track">
            <h2 class="scroll-drag-text"></h2>
            <div class="scroll-drag-doodles-layer"></div>
          </div>
        </div>
      </div>
    `;

    this.spacer = this.container.querySelector('.scroll-drag-spacer');
    this.wrapper = this.container.querySelector('.scroll-drag-track-wrapper');
    this.track = this.container.querySelector('.scroll-drag-track');
    this.textNode = this.container.querySelector('.scroll-drag-text');
    this.doodlesLayer = this.container.querySelector('.scroll-drag-doodles-layer');

    // Build letter spans & word nodes dynamically from sentence
    const words = this.config.sentence.trim().split(/\s+/);
    this.textNode.innerHTML = '';
    this.state.wordNodes = [];
    this.state.letterSpans = [];

    let globalLetterIndex = 0;
    words.forEach((wordText, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'scroll-drag-word';
      wordSpan.dataset.wordIndex = wordIdx;

      for (let i = 0; i < wordText.length; i++) {
        const char = wordText[i];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'scroll-drag-letter';
        letterSpan.innerText = char;
        letterSpan.dataset.letterIndex = globalLetterIndex++;
        wordSpan.appendChild(letterSpan);
        this.state.letterSpans.push(letterSpan);
      }

      this.textNode.appendChild(wordSpan);
      this.state.wordNodes.push(wordSpan);

      // Add space between words
      if (wordIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'scroll-drag-space';
        spaceSpan.innerHTML = '&nbsp;';
        this.textNode.appendChild(spaceSpan);
      }
    });

    // Auto-distribute doodle stickers across words
    this.buildDoodles(words.length);
  }

  buildDoodles(wordCount) {
    this.doodlesLayer.innerHTML = '';
    this.state.doodleElements = [];

    if (!this.config.autoDistribute) return;

    // Distribute doodles evenly across available words
    const library = this.doodleLibrary;
    const doodleCount = Math.min(library.length, wordCount + 2);

    for (let i = 0; i < doodleCount; i++) {
      const wordIndex = Math.floor((i / doodleCount) * wordCount);
      const doodleSpec = library[i % library.length];

      // Alternate offsets above and below the text line
      const isTop = i % 2 === 0;
      const oy = isTop ? -45 - (i % 3) * 12 : 35 + (i % 3) * 10;
      const ox = (i % 2 === 0 ? -12 : 14) + ((i * 7) % 20);
      const rot = (i % 2 === 0 ? -1 : 1) * (6 + (i * 5) % 15);

      const el = document.createElement('div');
      el.className = 'scroll-drag-doodle';
      el.style.width = `${doodleSpec.size}px`;
      el.style.height = `${doodleSpec.size}px`;
      el.style.color = doodleSpec.color;
      el.style.transform = `rotate(${rot}deg)`;
      el.innerHTML = doodleSpec.svg;

      el.dataset.wordIndex = wordIndex;
      el.dataset.ox = ox;
      el.dataset.oy = oy;

      this.doodlesLayer.appendChild(el);
      this.state.doodleElements.push(el);
    }
  }

  recalculateLayout() {
    this.state.viewportWidth = window.innerWidth;
    this.state.viewportHeight = window.innerHeight;

    const trackScrollWidth = this.track.scrollWidth;
    const maxDragDistance = Math.max(0, trackScrollWidth - this.state.viewportWidth + (this.state.viewportWidth * 0.06));
    const endBuffer = this.config.endBufferRatio * this.state.viewportHeight;
    const spacerHeight = this.state.viewportHeight + maxDragDistance + endBuffer;

    this.state.maxDragDistance = maxDragDistance;
    this.state.spacerHeight = spacerHeight;
    this.spacer.style.height = `${spacerHeight}px`;

    // Position static doodles relative to their anchored word nodes
    this.positionDoodles();
  }

  positionDoodles() {
    const trackRect = this.track.getBoundingClientRect();
    this.state.doodleElements.forEach((el) => {
      const wordIdx = parseInt(el.dataset.wordIndex, 10);
      const wordNode = this.state.wordNodes[wordIdx];
      if (!wordNode) return;

      const wordRect = wordNode.getBoundingClientRect();
      const ox = parseFloat(el.dataset.ox) || 0;
      const oy = parseFloat(el.dataset.oy) || 0;

      // Position relative to track content origin
      const leftPx = (wordRect.left - trackRect.left) + ox;
      const topPx = (wordRect.top - trackRect.top) + (wordRect.height / 2) + oy;

      el.style.left = `${leftPx}px`;
      el.style.top = `${topPx}px`;
    });
  }

  bindEvents() {
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.debounce(this.handleResize.bind(this), 100);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  handleScroll() {
    const rect = this.spacer.getBoundingClientRect();
    const spacerTop = window.scrollY + rect.top;
    const currentScroll = window.scrollY;

    const startPin = spacerTop;
    const endPin = spacerTop + this.state.maxDragDistance;

    if (currentScroll < startPin) {
      this.state.pinState = 'before';
      this.state.targetProgress = 0;
    } else if (currentScroll >= startPin && currentScroll <= endPin) {
      this.state.pinState = 'pinned';
      const progress = (currentScroll - startPin) / (this.state.maxDragDistance || 1);
      this.state.targetProgress = Math.min(1, Math.max(0, progress));
    } else {
      this.state.pinState = 'after';
      this.state.targetProgress = 1;
    }
  }

  handleResize() {
    this.recalculateLayout();
    this.handleScroll();
  }

  startAnimationLoop() {
    const loop = () => {
      // Lerp motion smoothing
      this.state.currentProgress += (this.state.targetProgress - this.state.currentProgress) * this.config.lerpFactor;

      // Update 3-state fixed pin positioning
      if (this.state.pinState === 'before') {
        this.wrapper.className = 'scroll-drag-track-wrapper pin-before';
        this.wrapper.style.position = 'absolute';
        this.wrapper.style.top = '0px';
        this.wrapper.style.bottom = 'auto';
      } else if (this.state.pinState === 'pinned') {
        this.wrapper.className = 'scroll-drag-track-wrapper pin-pinned';
        this.wrapper.style.position = 'fixed';
        this.wrapper.style.top = '0px';
        this.wrapper.style.bottom = 'auto';
      } else if (this.state.pinState === 'after') {
        this.wrapper.className = 'scroll-drag-track-wrapper pin-after';
        this.wrapper.style.position = 'absolute';
        this.wrapper.style.top = 'auto';
        this.wrapper.style.bottom = '0px';
      }

      // Horizontal Drag Translate + Subtle Lerp Skew
      const translateX = -this.state.currentProgress * this.state.maxDragDistance;
      const lerpGap = this.state.targetProgress - this.state.currentProgress;
      const skewX = Math.max(-6, Math.min(6, lerpGap * -60));

      this.track.style.transform = `translate3d(${translateX}px, 0, 0) skewX(${skewX}deg)`;

      // Per-letter Wave Wobble
      const { frequency, amplitude, phaseSpeed } = this.config;
      const phase = this.state.currentProgress * phaseSpeed;

      this.state.letterSpans.forEach((span) => {
        const idx = parseInt(span.dataset.letterIndex, 10);
        const y = Math.sin(idx * frequency + phase) * amplitude;
        const rot = Math.sin(idx * frequency + phase) * 4;
        span.style.transform = `translate3d(0, ${y}px, 0) rotate(${rot}deg)`;
      });

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Global Expose & Self-Init on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("scroll-drag-doodle-container")) {
    window.scrollDragDoodle = new ScrollDragDoodleComponent({
      containerId: "scroll-drag-doodle-container",
      sentence: "How our hybrid cipher layers three distinct cryptographic primitives",
      autoDistribute: true
    });
  }
});
