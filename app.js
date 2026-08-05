/* 
 * CIPHER, PAPER, SCISSORS - Full Encryption & Decryption Controller
 * Team: GreekGods (Aasutosh, Harshit, Kapil)
 */

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP Plugins
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // 1. DISTINCT HERO SECTION SCROLL ANIMATION (Hero Image Parallax + Upward Title Stretch)
        const heroSection = document.querySelector(".hero-section") || document.getElementById("hero-section");
        const heroTitle = document.getElementById("sticky-hero-title") || document.querySelector(".hero-title");
        const spotlightBox = document.getElementById("hero-spotlight-box") || document.querySelector(".hero-spotlight-box");

        if (heroSection && heroTitle) {
            gsap.fromTo(
                heroTitle,
                {
                    scaleY: 1,
                    transformOrigin: "bottom center",
                    filter: "drop-shadow(0 4px 28px rgba(0,0,0,0.45))",
                },
                {
                    scaleY: 2.2,
                    filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8))",
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroSection,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                }
            );

            if (spotlightBox) {
                gsap.fromTo(
                    spotlightBox,
                    { scale: 1 },
                    {
                        scale: 1.06,
                        ease: "none",
                        scrollTrigger: {
                            trigger: heroSection,
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );
            }
        }

        // 2. PLAINTEXT JOURNEY SCROLL ANIMATION & DETAILED STEP-BY-STEP CRYPTO MATH
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

        const stageFormulas = [
            "FORMULA: P = [S, E, R, E, N, O, V, A]",
            "FORMULA: C₁ = (P + 3) mod 26",
            "FORMULA: Digraph Matrix Swap [Key: ZEUS]",
            "FORMULA: C₃ = (C₂ ⊕ K) mod 26 [Key: K]"
        ];

        const stageStepTags = [
            "INPUT STAGE",
            "MOVE 1 OF 3",
            "MOVE 2 OF 3",
            "MOVE 3 OF 3 (FINAL)"
        ];

        const stageDescs = [
            "Raw input string 'SERENOVA' converted to upper-case letter indices [0-24] in the 25-letter Playfair alphabet (A-I, K-Z — J merges with I).",
            "Each letter index is rotated forward by key k₁ = 3 (mod 25). Pre-whitens letter frequency structure.",
            "Text is split into digraph pairs (VH, UH, QR, YD) & swapped using a 5×5 Playfair grid matrix [Key: ZEUS] to defeat single-character frequency analysis.",
            "Applies modular addition between letter indices and key stream 'K' (index 9) mod 25 to generate final ciphertext CSITAWFQ."
        ];

        // Detailed math breakdown cards for each stage
        const stageMathData = [
            // Stage 0: Plaintext indices (25-letter alphabet)
            [
                { from: "S", math: "Index 17", to: "17" },
                { from: "E", math: "Index 4", to: "4" },
                { from: "R", math: "Index 16", to: "16" },
                { from: "E", math: "Index 4", to: "4" },
                { from: "N", math: "Index 12", to: "12" },
                { from: "O", math: "Index 13", to: "13" },
                { from: "V", math: "Index 20", to: "20" },
                { from: "A", math: "Index 0", to: "0" }
            ],
            // Stage 1: Shift (+3 mod 25)
            [
                { from: "S (17)", math: "+ 3 mod 25", to: "V (20)" },
                { from: "E (4)", math: "+ 3 mod 25", to: "H (7)" },
                { from: "R (16)", math: "+ 3 mod 25", to: "U (19)" },
                { from: "E (4)", math: "+ 3 mod 25", to: "H (7)" },
                { from: "N (12)", math: "+ 3 mod 25", to: "Q (15)" },
                { from: "O (13)", math: "+ 3 mod 25", to: "R (16)" },
                { from: "V (20)", math: "+ 3 mod 25", to: "Y (23)" },
                { from: "A (0)", math: "+ 3 mod 25", to: "D (3)" }
            ],
            // Stage 2: Swap (Playfair 5×5 Pairs)
            [
                { from: "Pair 1: VH", math: "Matrix Swap", to: "TI" },
                { from: "Pair 2: UH", math: "Matrix Swap", to: "ZK" },
                { from: "Pair 3: QR", math: "Matrix Swap", to: "RN" },
                { from: "Pair 4: YD", math: "Matrix Swap", to: "WG" }
            ],
            // Stage 3: Flip (+K / index 9, mod 25)
            [
                { from: "T (18)", math: "+ K (9) mod 25", to: "C (2)" },
                { from: "I (8)", math: "+ K (9) mod 25", to: "S (17)" },
                { from: "Z (24)", math: "+ K (9) mod 25", to: "I (8)" },
                { from: "K (9)", math: "+ K (9) mod 25", to: "T (18)" },
                { from: "R (16)", math: "+ K (9) mod 25", to: "A (0)" },
                { from: "N (12)", math: "+ K (9) mod 25", to: "W (21)" },
                { from: "W (21)", math: "+ K (9) mod 25", to: "F (5)" },
                { from: "G (6)", math: "+ K (9) mod 25", to: "Q (15)" }
            ]
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
        const stageFormulaEl = document.getElementById("flow-formula");
        const stageStepTagEl = document.getElementById("flow-step-tag");
        const stageMathGridEl = document.getElementById("flow-math-grid");
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

        let lastStage = -1;

        function renderStageDetails(stageIdx) {
            if (stageIdx === lastStage) return;
            lastStage = stageIdx;

            if (stageTitleEl) stageTitleEl.innerText = stageTitles[stageIdx];
            if (stageFormulaEl) stageFormulaEl.innerText = stageFormulas[stageIdx];
            if (stageStepTagEl) stageStepTagEl.innerText = stageStepTags[stageIdx];
            if (stageDescEl) stageDescEl.innerText = stageDescs[stageIdx];

            if (stageMathGridEl) {
                stageMathGridEl.innerHTML = "";
                const items = stageMathData[stageIdx];
                items.forEach((item) => {
                    const card = document.createElement("div");
                    card.className = "flow-math-card";
                    card.innerHTML = `
                        <div class="math-from">${item.from}</div>
                        <div class="math-op">${item.math}</div>
                        <div class="math-to">${item.to}</div>
                    `;
                    stageMathGridEl.appendChild(card);
                });

                gsap.fromTo(".flow-math-card", 
                    { opacity: 0, y: 8 }, 
                    { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 }
                );
            }
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
                        renderStageDetails(currentStage);

                        if (lettersBoxEl) {
                            const cells = lettersBoxEl.querySelectorAll(".letter-cell");
                            const targetStr = stageTexts[currentStage];
                            cells.forEach((cell, idx) => {
                                if (targetStr && targetStr[idx] && cell.innerText !== targetStr[idx]) {
                                    cell.innerText = targetStr[idx];
                                    gsap.fromTo(cell, { scale: 1.25, color: "#D7A669" }, { scale: 1, color: "#0F0F0F", duration: 0.25 });
                                }
                            });
                        }
                    }
                }
            });
        }

        renderStageDetails(0);
    }

    // 3. LIVE INTERACTIVE ENCRYPTION & DECRYPTION SANDBOX MATRIX (SECTION 5)
    let currentMode = "encrypt"; // "encrypt" | "decrypt"

    const tabEncrypt = document.getElementById("tab-encrypt");
    const tabDecrypt = document.getElementById("tab-decrypt");
    const controlsTitle = document.getElementById("controls-title");
    const resultsTitle = document.getElementById("results-title");
    const inputLabel = document.getElementById("input-label");
    const actionBtn = document.getElementById("action-btn");
    const resetBtn = document.getElementById("reset-btn");

    const inputText = document.getElementById("input-text");
    const shiftKey = document.getElementById("shift-key");
    const matrixKey = document.getElementById("matrix-key");
    const xorKeyEl = document.getElementById("xor-key");

    const resInputLabel = document.getElementById("res-input-label");
    const resShiftLabel = document.getElementById("res-shift-label");
    const resSwapLabel = document.getElementById("res-swap-label");
    const resFinalLabel = document.getElementById("res-final-label");

    const resInput = document.getElementById("res-input");
    const resShift = document.getElementById("res-shift");
    const resSwap = document.getElementById("res-swap");
    const resFinal = document.getElementById("res-final");

    function runSandboxCipher() {
        if (!inputText || typeof CPSCipher === "undefined") return;

        const rawText = inputText.value.trim();
        const sKey = parseInt(shiftKey ? shiftKey.value : 3) || 3;
        const mKey = (matrixKey ? matrixKey.value.trim() : "ZEUS") || "ZEUS";
        const xKey = (xorKeyEl ? xorKeyEl.value.trim() : "K") || "K";

        if (currentMode === "encrypt") {
            const pText = rawText || "SERENOVA";
            const res = CPSCipher.encrypt(pText, mKey, sKey, xKey);

            if (resInputLabel) resInputLabel.innerText = "INPUT (PLAINTEXT):";
            if (resShiftLabel) resShiftLabel.innerText = "MOVE 1 (SHIFT):";
            if (resSwapLabel) resSwapLabel.innerText = "MOVE 2 (SWAP):";
            if (resFinalLabel) resFinalLabel.innerText = "MOVE 3 (FLIP/CIPHERTEXT):";

            if (resInput) resInput.innerText = res.plaintext;
            if (resShift) resShift.innerText = res.stage1_shift;
            if (resSwap) resSwap.innerText = res.stage2_swap;
            if (resFinal) resFinal.innerText = res.stage3_flip;
        } else {
            const cText = rawText || "CSITAWFQ";
            const dec = CPSCipher.decrypt(cText, mKey, sKey, xKey);

            if (resInputLabel) resInputLabel.innerText = "INPUT (CIPHERTEXT):";
            if (resShiftLabel) resShiftLabel.innerText = "REVERSE 3 (UNFLIP / XOR):";
            if (resSwapLabel) resSwapLabel.innerText = "REVERSE 2 (UNSWAP / PLAYFAIR):";
            if (resFinalLabel) resFinalLabel.innerText = "REVERSE 1 (UNSHIFT / RECOVERED PLAINTEXT):";

            if (resInput) resInput.innerText = dec.ciphertext;
            if (resShift) resShift.innerText = dec.unflip_swap;
            if (resSwap) resSwap.innerText = dec.unswap_shift;
            if (resFinal) resFinal.innerText = dec.recovered_plaintext;
        }
    }

    function switchMode(mode) {
        currentMode = mode;
        if (mode === "encrypt") {
            if (tabEncrypt) tabEncrypt.classList.add("active");
            if (tabDecrypt) tabDecrypt.classList.remove("active");
            if (controlsTitle) controlsTitle.innerText = "Encryption Controls";
            if (resultsTitle) resultsTitle.innerText = "Step-by-Step Encryption Output";
            if (inputLabel) inputLabel.innerText = "PLAINTEXT (Letters Only)";
            if (actionBtn) actionBtn.innerText = "Encrypt Text";
        } else {
            if (tabDecrypt) tabDecrypt.classList.add("active");
            if (tabEncrypt) tabEncrypt.classList.remove("active");
            if (controlsTitle) controlsTitle.innerText = "Decryption Controls";
            if (resultsTitle) resultsTitle.innerText = "Step-by-Step Decryption Output";
            if (inputLabel) inputLabel.innerText = "CIPHERTEXT (Encrypted Letters)";
            if (actionBtn) actionBtn.innerText = "Decrypt Text";

            // Automatically set input box to current encrypted ciphertext output
            if (resFinal && resFinal.innerText) {
                if (inputText) inputText.value = resFinal.innerText;
            }
        }
        runSandboxCipher();
    }

    if (tabEncrypt) tabEncrypt.addEventListener("click", () => switchMode("encrypt"));
    if (tabDecrypt) tabDecrypt.addEventListener("click", () => switchMode("decrypt"));

    if (inputText) inputText.addEventListener("input", runSandboxCipher);
    if (shiftKey) shiftKey.addEventListener("input", runSandboxCipher);
    if (matrixKey) matrixKey.addEventListener("input", runSandboxCipher);
    if (xorKeyEl) xorKeyEl.addEventListener("input", runSandboxCipher);
    if (actionBtn) actionBtn.addEventListener("click", runSandboxCipher);

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (shiftKey) shiftKey.value = "3";
            if (matrixKey) matrixKey.value = "ZEUS";
            if (xorKeyEl) xorKeyEl.value = "K";
            if (currentMode === "encrypt") {
                if (inputText) inputText.value = "SERENOVA";
            } else {
                if (inputText) inputText.value = "CSITAWFQ";
            }
            runSandboxCipher();
        });
    }

    switchMode("encrypt");
});
