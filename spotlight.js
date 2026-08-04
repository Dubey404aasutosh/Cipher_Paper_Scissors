(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const spotlightBox = document.querySelector("#hero-spotlight-box") || document.querySelector(".hero-spotlight-box");
    if (!spotlightBox) return;

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

    const lerpFactor = 0.08;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let isHovering = false;
    let currentOpacity = 0;
    let targetOpacity = 0;
    let rafId = null;

    spotlightBox.addEventListener("mousemove", (e) => {
      const rect = spotlightBox.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      isHovering = true;
      targetOpacity = 1;
    });

    spotlightBox.addEventListener("mouseleave", () => {
      isHovering = false;
      targetOpacity = 0;
    });

    function render() {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      currentOpacity += (targetOpacity - currentOpacity) * 0.05;

      if (isHovering || currentOpacity > 0.005) {
        revealImg.style.opacity = Math.min(currentOpacity, 0.95);

        // Soft radial gradient mask around cursor position
        const radiusX = 320;
        const radiusY = 260;

        revealImg.style.maskImage =
          "radial-gradient(ellipse " + radiusX + "px " + radiusY + "px at " + currentX + "px " + currentY + "px, " +
          "rgba(0,0,0,1) 0%, " +
          "rgba(0,0,0,0.85) 20%, " +
          "rgba(0,0,0,0.55) 45%, " +
          "rgba(0,0,0,0.25) 70%, " +
          "rgba(0,0,0,0.08) 85%, " +
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
