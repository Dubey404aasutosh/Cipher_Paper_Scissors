/**
 * Animated "Pipo" Bloom Field Mesh Gradient Engine
 * Recreated from 21st.dev (https://21st.dev/community/gradients)
 * Palette: Apricot (#E6B093), Sky blue (#A3CEFF), Paper (#FAF9EF)
 */
(function initPipoGradient() {
  function startGradient() {
    const bgElement = document.getElementById('pipo-bg') || document.body;

    const grainUrl = "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.305'/></svg>\")";

    // Blob parameters: anchor position, static phase, and gradient stops
    const blobs = [
      {
        // Apricot (#E6B093)
        baseX: 68.1,
        baseY: 46.03,
        pX: 0.0,
        pY: 1.2,
        stops: "rgba(230, 176, 147, 1) 0%, rgba(230, 176, 147, 0.844) 10.28%, rgba(230, 176, 147, 0.5) 20.55%, rgba(230, 176, 147, 0.156) 30.83%, rgba(230, 176, 147, 0) 41.1%"
      },
      {
        // Sky blue (#A3CEFF)
        baseX: 25.17,
        baseY: 75.99,
        pX: 2.1,
        pY: 3.4,
        stops: "rgba(163, 206, 255, 1) 0%, rgba(163, 206, 255, 0.844) 11.15%, rgba(163, 206, 255, 0.5) 22.3%, rgba(163, 206, 255, 0.156) 33.45%, rgba(163, 206, 255, 0) 44.6%"
      },
      {
        // Paper (#FAF9EF)
        baseX: 53.11,
        baseY: 12.71,
        pX: 4.3,
        pY: 5.1,
        stops: "rgba(250, 249, 239, 1) 0%, rgba(250, 249, 239, 0.844) 16.66%, rgba(250, 249, 239, 0.5) 33.33%, rgba(250, 249, 239, 0.156) 49.99%, rgba(250, 249, 239, 0) 66.65%"
      }
    ];

    const amt = 0.72;
    const startTime = performance.now();

    function render(now) {
      const t = (now - startTime) / 1000;
      const ph = t * 0.86;

      const gradientParts = blobs.map(blob => {
        // Continuous modulation formula: (sin(ph * freq + phase) - sin(phase)) * 14 * amt
        // Ensures modulation starts smoothly at exactly 0 when ph = 0
        const modX = (Math.sin(ph * 0.55 + blob.pX) - Math.sin(blob.pX)) * 14 * amt;
        const modY = (Math.sin(ph * 0.43 + blob.pY) - Math.sin(blob.pY)) * 14 * amt;

        const currentX = blob.baseX + modX;
        const currentY = blob.baseY + modY;

        return `radial-gradient(circle at ${currentX}% ${currentY}%, ${blob.stops})`;
      });

      bgElement.style.backgroundColor = "#FAF8EE";
      bgElement.style.backgroundImage = `${grainUrl}, ${gradientParts.join(', ')}`;
      bgElement.style.backgroundSize = "120px 120px, auto, auto, auto";
      bgElement.style.backgroundBlendMode = "overlay, normal, normal, normal";

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGradient);
  } else {
    startGradient();
  }
})();
