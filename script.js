document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");
  const debugToggleBtn = document.getElementById("debug-toggle-btn");
  const debugStats = document.getElementById("debug-stats");
  const hudOverlayClip = document.getElementById("hud-overlay-clip");
  const hudStatus = document.getElementById("hud-status");
  const replayBtn = document.getElementById("replay-btn");

  let isDebugActive = false;
  let isAnimating = false;

  function toggleDebug() {
    isDebugActive = !isDebugActive;
    document.body.classList.toggle("debug-mode", isDebugActive);
    if (debugToggleBtn) {
      debugToggleBtn.classList.toggle("active", isDebugActive);
      debugToggleBtn.innerText = isDebugActive ? "🐞 DEBUG MODE: ON" : "🐞 DEBUG MODE: OFF";
    }
    if (debugStats) {
      debugStats.style.display = isDebugActive ? "flex" : "none";
    }
  }

  // Smooth Extended Shutter Preloader Sequence (Reduced Shutter Velocity)
  function runBalancedShutterPreloader() {
    if (isAnimating) return;
    isAnimating = true;

    // Reset initial states for all 10 layers & overlay
    gsap.killTweensOf([".overlay", "h2", "h2 div", ".loader", ".loader .img"]);

    gsap.set([".overlay", ".loader"], { display: "block" });
    gsap.set(".overlay", {
      clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
      pointerEvents: "none"
    });
    gsap.set("h2 div", { yPercent: 100 });
    gsap.set("h2", { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" });
    gsap.set(".loader", {
      clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)"
    });
    gsap.set(".loader .img", {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
    });

    if (hudStatus) hudStatus.innerText = "Firing Shutter Stack (10 Layers)...";
    if (hudOverlayClip) hudOverlayClip.innerText = "polygon(0 100%, 100% 100%, 100% 0, 0 0)";

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        if (hudStatus) hudStatus.innerText = "Shutter Complete / Page Unlocked";
        if (hudOverlayClip) hudOverlayClip.innerText = "polygon(0 0, 100% 0, 100% 0, 0 0)";
        gsap.set([".overlay", ".loader"], { display: "none" });
      }
    });

    // Step 1: Text slide-in (1.2s)
    tl.to("h2 div", {
      duration: 1.2,
      yPercent: 0,
      ease: "power4.out",
      stagger: { amount: 0.4 }
    }, 0);

    // Step 2: Text slide-out (1.0s)
    tl.to("h2 div", {
      duration: 1.0,
      yPercent: -100,
      ease: "power3.inOut",
      stagger: { amount: 0.35 }
    }, 1.4);

    // Step 3: Overlay polygon collapse (1.2s)
    tl.to(".overlay", {
      duration: 1.2,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      ease: "power4.inOut"
    }, 1.9);

    // Step 4: 10-layer shutter stagger reveal (Reduced velocity: 1.6s per layer, 2.0s total stagger)
    tl.to(".loader .img", {
      duration: 1.6,
      clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0% 0%)",
      ease: "power4.inOut",
      stagger: {
        amount: 2.0,
        ease: "power2.inOut"
      }
    }, 2.2);

    // Step 5: Collapse loader container to unlock landing page (1.2s)
    tl.to(".loader", {
      duration: 1.2,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      ease: "power4.inOut"
    }, 4.0);
  }

  // Replay Button listener
  if (replayBtn) {
    replayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      runBalancedShutterPreloader();
    });
  }

  // Keyboard shortcut listener ('D' for Debug, 'R' for Replay)
  window.addEventListener("keydown", (e) => {
    if (e.key === "d" || e.key === "D") {
      toggleDebug();
    }
    if (e.key === "r" || e.key === "R") {
      runBalancedShutterPreloader();
    }
  });

  if (debugToggleBtn) {
    debugToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDebug();
    });
  }

  // Automatically trigger preloader
  runBalancedShutterPreloader();
});
