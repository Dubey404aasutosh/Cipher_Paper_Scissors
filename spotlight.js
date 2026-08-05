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

    // High performance lerp variables for spotlight mask
    const lerpFactor = 0.22;
    let targetX = rect.width / 2;
    let targetY = rect.height / 2;
    let currentX = targetX;
    let currentY = targetY;
    let currentOpacity = 0;
    let targetOpacity = 0;

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
    }, { passive: true });

    targetElement.addEventListener("mouseleave", () => {
      targetOpacity = 0;
    }, { passive: true });

    // Pre-calculate mask string template to avoid string allocation lag
    const radiusX = 340;
    const radiusY = 280;

    function render() {
      // Spotlight Linear Interpolation
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      currentOpacity += (targetOpacity - currentOpacity) * 0.2;

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
