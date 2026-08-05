/* 
 * CIPHER, PAPER, SCISSORS - App Controller
 * Lenis Smooth Scroll, GSAP Wonjyou Sticky Title Stretch, Journey Pinned Scroll & Live Sandbox
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. LENIS INERTIA SMOOTH SCROLL CONFIGURATION (Wonjyou Blueprint)
    let lenis = null;
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
        });

        if (typeof ScrollTrigger !== "undefined") {
            lenis.on("scroll", ScrollTrigger.update);
        }

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Register GSAP Plugins
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // 2. WONJYOU STICKY SCROLLING TYPOGRAPHY STRETCH ANIMATION (Hero Title Stretch)
        const heroRunway = document.getElementById("hero-runway") || document.querySelector(".hero-runway-track");
        const heroTitle = document.getElementById("sticky-hero-title") || document.querySelector(".hero-title");
        const wordmarkBox = document.getElementById("wordmark-container") || document.querySelector(".wordmark-container");

        if (heroRunway && heroTitle) {
            // Formula for vertical stretch target scale
            const calculateScaleY = () => {
                const windowH = window.innerHeight;
                const titleH = heroTitle.getBoundingClientRect().height || 120;
                return Math.max(2.8, (windowH / titleH) * 1.65);
            };

            const targetScale = calculateScaleY();

            gsap.fromTo(
                heroTitle,
                {
                    scaleY: 1,
                    transformOrigin: "bottom center",
                    filter: "drop-shadow(0 4px 28px rgba(0,0,0,0.45))",
                },
                {
                    scaleY: targetScale,
                    filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9))",
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRunway,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.0,
                        invalidateOnRefresh: true,
                    },
                }
            );
        }

        // 3. PLAINTEXT JOURNEY SCROLL ANIMATION (SECTION 4)
        const sampleWord = "SERENOVA";
        const playfairKey = "ZEUS";
        const caesarShift = 3;
        const xorKey = "K";

        let encResult = {
            plaintext: "SERENOVA",
            stage1_shift: "VHUHQRYD",
            stage2_swap: "WMVIVSZB",
            stage3_flip: "GOWOFLPR"
        };

        if (typeof CPSCipher !== "undefined") {
            encResult = CPSCipher.encrypt(sampleWord, playfairKey, caesarShift, xorKey);
        }

        // Render Initial Letter Cells
        const lettersBoxEl = document.getElementById("letters-box");
        function renderLetterCells(wordText) {
            if (!lettersBoxEl) return;
            lettersBoxEl.innerHTML = "";
            for (let char of wordText) {
                const cell = document.createElement("div");
                cell.className = "letter-cell";
                cell.innerText = char;
                lettersBoxEl.appendChild(cell);
            }
        }
        renderLetterCells(encResult.plaintext);

        const stageTitles = [
            "STAGE 0: ORIGINAL PLAINTEXT",
            "STAGE 1: SHIFT (CAESAR +3)",
            "STAGE 2: SWAP (PLAYFAIR 5x5)",
            "STAGE 3: FLIP (LETTER XOR)"
        ];

        const stageDescs = [
            "Sample Word: SERENOVA (Scroll down to watch transformation)",
            "Shifted text forward by 3 alphabet positions: S->V, E->H, R->U...",
            "Substituted digraphs using 5x5 Playfair grid matrix.",
            "Final Letter-Domain XOR applied against key 'K'."
        ];

        const stageTexts = [
            encResult.plaintext,
            encResult.stage1_shift,
            encResult.stage2_swap,
            encResult.stage3_flip
        ];

        const stagePills = [
            document.getElementById("pill-0"),
            document.getElementById("pill-1"),
            document.getElementById("pill-2"),
            document.getElementById("pill-3")
        ];

        const stageTitleEl = document.getElementById("stage-title");
        const stageDescEl = document.getElementById("stage-desc");

        function setActivePill(activeIdx) {
            stagePills.forEach((pill, idx) => {
                if (pill) {
                    if (idx === activeIdx) {
                        pill.classList.add("active");
                    } else {
                        pill.classList.remove("active");
                    }
                }
            });
        }

        const journeyEl = document.getElementById("journey");
        if (journeyEl) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: "#journey",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        let currentStage = 0;

                        if (progress >= 0.75) {
                            currentStage = 3;
                        } else if (progress >= 0.45) {
                            currentStage = 2;
                        } else if (progress >= 0.18) {
                            currentStage = 1;
                        } else {
                            currentStage = 0;
                        }

                        setActivePill(currentStage);
                        if (stageTitleEl) stageTitleEl.innerText = stageTitles[currentStage];
                        if (stageDescEl) stageDescEl.innerText = stageDescs[currentStage];

                        if (lettersBoxEl) {
                            const cells = lettersBoxEl.querySelectorAll(".letter-cell");
                            const targetStr = stageTexts[currentStage];
                            cells.forEach((cell, idx) => {
                                if (targetStr && targetStr[idx] && cell.innerText !== targetStr[idx]) {
                                    cell.innerText = targetStr[idx];
                                    gsap.fromTo(cell, { scale: 1.25, color: "#D7A669" }, { scale: 1, color: "#0F0F0F", duration: 0.35 });
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    // 4. LIVE INTERACTIVE SANDBOX MATRIX (SECTION 5)
    const inputText = document.getElementById("input-text");
    const shiftKey = document.getElementById("shift-key");
    const matrixKey = document.getElementById("matrix-key");
    const xorKeyEl = document.getElementById("xor-key");
    const encryptBtn = document.getElementById("encrypt-btn");
    const resetBtn = document.getElementById("reset-btn");

    const resInput = document.getElementById("res-input");
    const resShift = document.getElementById("res-shift");
    const resSwap = document.getElementById("res-swap");
    const resFinal = document.getElementById("res-final");

    function runSandboxEncryption() {
        if (!inputText || typeof CPSCipher === "undefined") return;

        const pText = inputText.value.trim() || "SERENOVA";
        const sKey = parseInt(shiftKey ? shiftKey.value : 3) || 3;
        const mKey = (matrixKey ? matrixKey.value.trim() : "ZEUS") || "ZEUS";
        const xKey = (xorKeyEl ? xorKeyEl.value.trim() : "K") || "K";

        const res = CPSCipher.encrypt(pText, mKey, sKey, xKey);

        if (resInput) resInput.innerText = res.plaintext;
        if (resShift) resShift.innerText = res.stage1_shift;
        if (resSwap) resSwap.innerText = res.stage2_swap;
        if (resFinal) resFinal.innerText = res.stage3_flip;
    }

    if (inputText) inputText.addEventListener("input", runSandboxEncryption);
    if (shiftKey) shiftKey.addEventListener("input", runSandboxEncryption);
    if (matrixKey) matrixKey.addEventListener("input", runSandboxEncryption);
    if (xorKeyEl) xorKeyEl.addEventListener("input", runSandboxEncryption);
    if (encryptBtn) encryptBtn.addEventListener("click", runSandboxEncryption);

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (inputText) inputText.value = "SERENOVA";
            if (shiftKey) shiftKey.value = "3";
            if (matrixKey) matrixKey.value = "ZEUS";
            if (xorKeyEl) xorKeyEl.value = "K";
            runSandboxEncryption();
        });
    }

    runSandboxEncryption();
});
