(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const spotlightBox = document.querySelector("#hero-spotlight-box") || document.querySelector(".hero-spotlight-box");
    if (!spotlightBox) return;

    const heroSection = document.querySelector(".hero-section") || document.getElementById("hero-section");
    const heroFrame = document.querySelector(".hero-page-frame");
    const wordmarkContainer = document.querySelector(".wordmark-container");
    const topControls = document.querySelector(".hero-top-controls");

    // Create container
    const container = document.createElement("div");
    container.className = "spotlight-hero-container";

    // Base Image (H.png — warm marble, always visible)
    const baseImg = document.createElement("img");
    baseImg.src = "assets/H.png";
    baseImg.alt = "Cipher Paper Scissors Base";
    baseImg.className = "spotlight-img spotlight-base";
    baseImg.draggable = false;

    // Reveal Image (H.H.png — dark obsidian, revealed on mouse move)
    const revealImg = document.createElement("img");
    revealImg.src = "assets/H.H.png";
    revealImg.alt = "Cipher Paper Scissors Reveal";
    revealImg.className = "spotlight-img spotlight-reveal";
    revealImg.draggable = false;

    container.appendChild(baseImg);
    container.appendChild(revealImg);
    spotlightBox.appendChild(container);

    // Cache box rect to prevent layout thrashing on mousemove
    let rect = spotlightBox.getBoundingClientRect();
    const updateRect = () => {
      rect = spotlightBox.getBoundingClientRect();
    };
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });

    // High performance lerp variables for spotlight mask
    const lerpFactor = 0.22;
    let targetX = rect.width / 2;
    let targetY = rect.height / 2;
    let currentX = targetX;
    let currentY = targetY;
    let currentOpacity = 0;
    let targetOpacity = 0;

    // Parallax Normalized Mouse Targets (-1 to +1)
    let pTargetX = 0;
    let pTargetY = 0;
    let pCurrentX = 0;
    let pCurrentY = 0;

    const targetElement = heroSection || spotlightBox;

    targetElement.addEventListener("mouseenter", () => {
      updateRect();
      targetOpacity = 1;
    }, { passive: true });

    targetElement.addEventListener("mousemove", (e) => {
      // Spotlight Mask Targets
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = 1;

      // Parallax Normalized Targets (-1 to 1)
      const secRect = targetElement.getBoundingClientRect();
      const centerX = secRect.left + secRect.width / 2;
      const centerY = secRect.top + secRect.height / 2;
      pTargetX = (e.clientX - centerX) / (secRect.width / 2);
      pTargetY = (e.clientY - centerY) / (secRect.height / 2);
    }, { passive: true });

    targetElement.addEventListener("mouseleave", () => {
      targetOpacity = 0;
      pTargetX = 0;
      pTargetY = 0;
    }, { passive: true });

    // Pre-calculate mask string template to avoid string allocation lag
    const radiusX = 340;
    const radiusY = 280;

    function render() {
      // Spotlight Linear Interpolation
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      currentOpacity += (targetOpacity - currentOpacity) * 0.2;

      // Parallax Linear Interpolation (Silkier lerp dampening)
      pCurrentX += (pTargetX - pCurrentX) * 0.045;
      pCurrentY += (pTargetY - pCurrentY) * 0.045;

      // Apply Refined 3D Micro-Parallax Layers
      if (heroFrame) {
        const rotX = -pCurrentY * 1.8;
        const rotY = pCurrentX * 2.2;
        heroFrame.style.transform = `perspective(1400px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      }

      if (container) {
        const imgX = -pCurrentX * 8;
        const imgY = -pCurrentY * 6;
        container.style.transform = `translate3d(${imgX.toFixed(2)}px, ${imgY.toFixed(2)}px, 0) scale(1.015)`;
      }

      if (wordmarkContainer) {
        const titleX = pCurrentX * 10;
        const titleY = pCurrentY * 6;
        wordmarkContainer.style.transform = `translate3d(${titleX.toFixed(2)}px, ${titleY.toFixed(2)}px, 0)`;
      }

      if (topControls) {
        const ctrlX = pCurrentX * 5;
        const ctrlY = pCurrentY * 3;
        topControls.style.transform = `translate3d(${ctrlX.toFixed(2)}px, ${ctrlY.toFixed(2)}px, 0)`;
      }

      // Render Spotlight Mask
      if (currentOpacity > 0.001) {
        revealImg.style.opacity = Math.min(currentOpacity, 0.98);

        const maskVal = `radial-gradient(ellipse ${radiusX}px ${radiusY}px at ${Math.round(currentX)}px ${Math.round(currentY)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 25%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0) 100%)`;
        
        revealImg.style.webkitMaskImage = maskVal;
        revealImg.style.maskImage = maskVal;
      } else {
        revealImg.style.opacity = '0';
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  });
})();
