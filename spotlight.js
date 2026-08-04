(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    // Create wrapper container for Cursor Reveal
    const spotlightContainer = document.createElement("div");
    spotlightContainer.className = "spotlight-hero-container";

    // Base Image Div (always visible - H.png)
    const baseDiv = document.createElement("div");
    baseDiv.className = "spotlight-base";

    // Reveal Image Div (hidden, shown through curtain wipe - H.H.png)
    const revealDiv = document.createElement("div");
    revealDiv.className = "spotlight-reveal";

    // Canvas Div (hidden canvas container)
    const canvasDiv = document.createElement("div");
    canvasDiv.className = "spotlight-canvas-wrapper";
    const canvas = document.createElement("canvas");
    canvas.className = "spotlight-canvas";
    canvasDiv.appendChild(canvas);

    spotlightContainer.appendChild(baseDiv);
    spotlightContainer.appendChild(revealDiv);
    spotlightContainer.appendChild(canvasDiv);

    // Insert as background of hero section
    heroSection.insertBefore(spotlightContainer, heroSection.firstChild);

    const ctx = canvas.getContext("2d");
    const lerpFactor = 0.1;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let animationFrameId = null;

    function updateCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function onMouseMove(e) {
      const rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    }

    window.addEventListener("mousemove", onMouseMove);

    function render() {
      // Lerp mouse position
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth non-circular curtain wipe passing through currentX with a 140px soft feathered edge
      const fadeWidth = 140;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);

      const pStart = Math.max(0, (currentX - fadeWidth) / width);
      const pEnd = Math.min(1, (currentX + fadeWidth) / width);

      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(pStart, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(pEnd, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Apply canvas.toDataURL() as maskImage + webkitMaskImage on reveal div
      const maskUrl = `url(${canvas.toDataURL()})`;
      revealDiv.style.maskImage = maskUrl;
      revealDiv.style.webkitMaskImage = maskUrl;

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);
  });
})();
