/* 
 * CIPHER, PAPER, SCISSORS - App Controller
 * Handles Lenis smooth scroll, GSAP scroll-driven animations, Preloader & Sandbox
 */

document.addEventListener("DOMContentLoaded", () => {

    // 1. PRELOADER SCRAMBLE ANIMATION
    const scrambleEl = document.getElementById("scramble-text");
    const targetText = "CIPHER PAPER SCISSORS";
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
    let iteration = 0;

    const interval = setInterval(() => {
        scrambleEl.innerText = targetText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return targetText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        if (iteration >= targetText.length) {
            clearInterval(interval);
            setTimeout(() => {
                const preloader = document.getElementById("preloader");
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
            }, 500);
        }
        iteration += 1 / 2;
    }, 40);

    // 2. LENIS SMOOTH SCROLL INITIALIZATION
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 3. SAMPLE DATA & PLAYFAIR MATRIX SETUP
    const sampleWord = "SERENOVA";
    const playfairKey = "GREEKGODS";
    const caesarShift = 3;
    const xorKey = "ZEUS";

    // Run Full Cipher Engine on Sample Word
    const encResult = CPSCipher.encrypt(sampleWord, playfairKey, caesarShift, xorKey);

    // Render Playfair Matrix Grid UI
    const matrixGridEl = document.getElementById("matrix-grid");
    matrixGridEl.innerHTML = "";
    encResult.playfair_matrix.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "matrix-cell";
            cellDiv.dataset.char = cell;
            cellDiv.innerText = cell;
            matrixGridEl.appendChild(cellDiv);
        });
    });

    // Render Initial Letter Cells
    const lettersBoxEl = document.getElementById("letters-box");
    function renderLetterCells(wordText) {
        lettersBoxEl.innerHTML = "";
        for (let char of wordText) {
            const cell = document.createElement("div");
            cell.className = "letter-cell";
            cell.innerText = char;
            lettersBoxEl.appendChild(cell);
        }
    }
    renderLetterCells(encResult.plaintext);

    // 4. GSAP SCROLL-DRIVEN TRANSFORMATION ANIMATION
    gsap.registerPlugin(ScrollTrigger);

    const stageTitles = [
        "STAGE 0: ORIGINAL PLAINTEXT",
        "STAGE 1: SHIFT (CAESAR +3)",
        "STAGE 2: SWAP (PLAYFAIR 5x5)",
        "STAGE 3: FLIP (LETTER XOR)"
    ];

    const stageDescs = [
        "Sample Word: SERENOVA (Scroll down to watch transformation)",
        "Shifted text forward by 3 alphabet positions: S->V, E->H, R->U...",
        "Substituted digraphs (VH, HU, QR, YD) using 5x5 Playfair grid matrix.",
        "Final Letter-Domain XOR applied against key 'ZEUS'."
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
    const matrixWrapperEl = document.getElementById("matrix-wrapper");

    // Helper to highlight active stage pill
    function setActivePill(activeIdx) {
        stagePills.forEach((pill, idx) => {
            if (idx === activeIdx) {
                pill.classList.add("active");
            } else {
                pill.classList.remove("active");
            }
        });
    }

    // ScrollTrigger Timeline for Section 4
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#journey",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
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

                // Update UI state
                setActivePill(currentStage);
                stageTitleEl.innerText = stageTitles[currentStage];
                stageDescEl.innerText = stageDescs[currentStage];

                // Update Word Letters
                const cells = lettersBoxEl.querySelectorAll(".letter-cell");
                const targetStr = stageTexts[currentStage];
                cells.forEach((cell, idx) => {
                    if (targetStr[idx] && cell.innerText !== targetStr[idx]) {
                        cell.innerText = targetStr[idx];
                        // Pulse effect on change
                        gsap.fromTo(cell, { scale: 1.2, borderColor: "#00FF66" }, { scale: 1, borderColor: "rgba(255, 255, 255, 0.1)", duration: 0.3 });
                    }
                });

                // Toggle Matrix highlight visibility on Stage 2
                if (currentStage === 2) {
                    matrixWrapperEl.style.opacity = "1";
                } else {
                    matrixWrapperEl.style.opacity = "0.3";
                }
            }
        }
    });

    // 5. LIVE INTERACTIVE SANDBOX HANDLER
    const sbInput = document.getElementById("sb-input");
    const sbKey1 = document.getElementById("sb-key1");
    const sbShift = document.getElementById("sb-shift");
    const sbKey2 = document.getElementById("sb-key2");
    const sbCiphertext = document.getElementById("sb-ciphertext");
    const sbDecrypted = document.getElementById("sb-decrypted");

    function updateSandbox() {
        const text = sbInput.value.trim() || "SERENOVA";
        const k1 = sbKey1.value.trim() || "GREEKGODS";
        const shiftVal = parseInt(sbShift.value) || 3;
        const k2 = sbKey2.value.trim() || "ZEUS";

        const encrypted = CPSCipher.encrypt(text, k1, shiftVal, k2);
        const decrypted = CPSCipher.decrypt(encrypted.stage3_flip, k1, shiftVal, k2);

        sbCiphertext.innerText = encrypted.stage3_flip;
        sbDecrypted.innerText = decrypted.recovered_plaintext;
    }

    [sbInput, sbKey1, sbShift, sbKey2].forEach(input => {
        input.addEventListener("input", updateSandbox);
    });

    // Initial sandbox run
    updateSandbox();
});
