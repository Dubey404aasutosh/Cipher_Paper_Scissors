import React, { useEffect, useRef } from 'react';

/**
 * CursorSpotlightReveal - Mouse-driven split curtain transition component.
 * Dual pixel-perfect stacked images:
 * - Base image (always visible): assets/H.png (White marble statue)
 * - Reveal image (hidden, revealed on mouse move): assets/H.H.png (Dark obsidian statue)
 *
 * Core mechanic:
 * - Track mouse position. Smooth it with lerp factor 0.1 via requestAnimationFrame.
 * - On each frame, draw a smooth linear gradient wipe on canvas tracking mouse X/Y.
 * - Apply canvas.toDataURL() as maskImage + webkitMaskImage on the reveal div.
 * - Clean up mousemove listener and cancel RAF on unmount.
 */
export default function CursorSpotlightReveal({
  baseImage = 'assets/H.png',
  revealImage = 'assets/H.H.png',
  lerpFactor = 0.1
}) {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const revealDiv = revealRef.current;
    const containerDiv = containerRef.current;
    if (!canvas || !revealDiv || !containerDiv) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Smooth position with lerp factor 0.1
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth curtain wipe passing through currentX with a 140px feathered edge
      const fadeWidth = 140;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);

      const pStart = Math.max(0, (currentX - fadeWidth) / width);
      const pEnd = Math.min(1, (currentX + fadeWidth) / width);

      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(pStart, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(pEnd, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Apply canvas.toDataURL() as maskImage + webkitMaskImage on reveal div
      const maskDataUrl = `url(${canvas.toDataURL()})`;
      revealDiv.style.maskImage = maskDataUrl;
      revealDiv.style.webkitMaskImage = maskDataUrl;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [lerpFactor]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Base image (always visible) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${baseImage})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 10
        }}
      />

      {/* Reveal image (hidden, only shown through cursor wipe) */}
      <div
        ref={revealRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${revealImage})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 30,
          pointerEvents: 'none'
        }}
      />

      {/* Hidden Canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'none'
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
