(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    // Create wrapper
    const container = document.createElement("div");
    container.className = "spotlight-hero-container";

    // Base image (H.png — warm marble, always visible)
    const baseImg = document.createElement("img");
    baseImg.src = "assets/H.png";
    baseImg.alt = "";
    baseImg.className = "spotlight-img spotlight-base";
    baseImg.draggable = false;

    // Reveal image (H.H.png — dark obsidian, revealed by mouse)
    const revealImg = document.createElement("img");
    revealImg.src = "assets/H.H.png";
    revealImg.alt = "";
    revealImg.className = "spotlight-img spotlight-reveal";
    revealImg.draggable = false;

    container.appendChild(baseImg);
    container.appendChild(revealImg);
    heroSection.insertBefore(container, heroSection.firstChild);

    const lerpFactor = 0.06;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let isHovering = false;
    let currentOpacity = 0;
    let targetOpacity = 0;
    let rafId = null;

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      isHovering = true;
      targetOpacity = 1;
    });

    heroSection.addEventListener("mouseleave", () => {
      isHovering = false;
      targetOpacity = 0;
    });

    function render() {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      currentOpacity += (targetOpacity - currentOpacity) * 0.04;

      if (isHovering || currentOpacity > 0.005) {
        revealImg.style.opacity = Math.min(currentOpacity, 0.85);

        // MASSIVE ultra-soft gradient — covers nearly the entire viewport
        // So enormous that there is ZERO visible edge, circle, or boundary
        // Just a gentle atmospheric darkening/mood shift following the cursor
        const w = heroSection.offsetWidth;
        const h = heroSection.offsetHeight;
        const radiusX = w * 0.7;  // 70% of viewport width
        const radiusY = h * 0.85; // 85% of viewport height

        revealImg.style.maskImage =
          "radial-gradient(ellipse " + radiusX + "px " + radiusY + "px at " + currentX + "px " + currentY + "px, " +
          "rgba(0,0,0,1) 0%, " +
          "rgba(0,0,0,0.9) 10%, " +
          "rgba(0,0,0,0.7) 25%, " +
          "rgba(0,0,0,0.45) 45%, " +
          "rgba(0,0,0,0.2) 65%, " +
          "rgba(0,0,0,0.08) 80%, " +
          "rgba(0,0,0,0.02) 90%, " +
          "rgba(0,0,0,0) 100%)";
        revealImg.style.webkitMaskImage = revealImg.style.maskImage;
      } else {
        revealImg.style.opacity = 0;
        revealImg.style.maskImage = "none";
        revealImg.style.webkitMaskImage = "none";
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);
  });
})();
