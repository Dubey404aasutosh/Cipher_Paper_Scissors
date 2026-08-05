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

    // Step 1: Fast text slide-in (0.7s)
    tl.to("h2 div", {
      duration: 0.7,
      yPercent: 0,
      ease: "power4.out",
      stagger: { amount: 0.25 }
    }, 0);

    // Step 2: Fast text slide-out (0.5s)
    tl.to("h2 div", {
      duration: 0.5,
      yPercent: -100,
      ease: "power3.inOut",
      stagger: { amount: 0.2 }
    }, 0.8);

    // Step 3: Overlay polygon collapse (0.6s)
    tl.to(".overlay", {
      duration: 0.6,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      ease: "power4.inOut"
    }, 1.1);

    // Step 4: 10-layer shutter stagger reveal (Faster 0.7s per layer, 0.8s total stagger)
    tl.to(".loader .img", {
      duration: 0.7,
      clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0% 0%)",
      ease: "power4.inOut",
      stagger: {
        amount: 0.8,
        ease: "power2.inOut"
      }
    }, 1.3);

    // Step 5: Collapse loader container to unlock landing page (0.6s)
    tl.to(".loader", {
      duration: 0.6,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      ease: "power4.inOut"
    }, 2.2);
  }

  // Replay Button listener
  if (replayBtn) {
    replayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      runBalancedShutterPreloader();
    });
  }

  // Keyboard shortcut listener ('D' for Debug, 'R' for Replay)
  // Fix: Check if user is typing in an input or textarea element
  window.addEventListener("keydown", (e) => {
    const targetTag = e.target ? e.target.tagName : "";
    if (targetTag === "INPUT" || targetTag === "TEXTAREA" || (e.target && e.target.isContentEditable)) {
      return; // Do not trigger shortcuts while user is typing in form fields!
    }

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
