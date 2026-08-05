/* 
 * CIPHER, PAPER, SCISSORS - Step-by-Step Cryptographic Flow Controller
 * Detailed Character-by-Character Transformation Math Breakdown (Shift -> Swap -> Flip)
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
            "Raw input string 'SERENOVA' converted to upper-case letter vectors [0-25] before encryption.",
            "Each letter index is rotated forward by key k₁ = 3 (mod 26). Pre-whitens letter frequency structure.",
            "Text is split into digraph pairs (VH, UH, QR, YD) & swapped using a 5x5 Playfair grid matrix [Key: ZEUS] to defeat single-character frequency analysis.",
            "Applies 5-bit XOR between letter indices and key stream 'K' (index 10), mapped losslessly back into [A-Z] domain to generate final ciphertext GOWOFLPR."
        ];

        // Detailed math breakdown cards for each stage
        const stageMathData = [
            // Stage 0
            [
                { from: "S", math: "Index 18", to: "18" },
                { from: "E", math: "Index 4", to: "4" },
                { from: "R", math: "Index 17", to: "17" },
                { from: "E", math: "Index 4", to: "4" },
                { from: "N", math: "Index 13", to: "13" },
                { from: "O", math: "Index 14", to: "14" },
                { from: "V", math: "Index 21", to: "21" },
                { from: "A", math: "Index 0", to: "0" }
            ],
            // Stage 1: Shift (+3)
            [
                { from: "S (18)", math: "+ 3 mod 26", to: "V (21)" },
                { from: "E (4)", math: "+ 3 mod 26", to: "H (7)" },
                { from: "R (17)", math: "+ 3 mod 26", to: "U (20)" },
                { from: "E (4)", math: "+ 3 mod 26", to: "H (7)" },
                { from: "N (13)", math: "+ 3 mod 26", to: "Q (16)" },
                { from: "O (14)", math: "+ 3 mod 26", to: "R (17)" },
                { from: "V (21)", math: "+ 3 mod 26", to: "Y (24)" },
                { from: "A (0)", math: "+ 3 mod 26", to: "D (3)" }
            ],
            // Stage 2: Swap (Playfair 5x5 Pairs)
            [
                { from: "Pair 1: VH", math: "Matrix Swap", to: "WM" },
                { from: "Pair 2: UH", math: "Matrix Swap", to: "VI" },
                { from: "Pair 3: QR", math: "Matrix Swap", to: "VS" },
                { from: "Pair 4: YD", math: "Matrix Swap", to: "ZB" }
            ],
            // Stage 3: Flip (XOR 'K' / 10)
            [
                { from: "W (22)", math: "⊕ K (10)", to: "G (6)" },
                { from: "M (12)", math: "⊕ K (10)", to: "O (14)" },
                { from: "V (21)", math: "⊕ K (10)", to: "W (22)" },
                { from: "I (8)", math: "⊕ K (10)", to: "O (14)" },
                { from: "V (21)", math: "⊕ K (10)", to: "F (5)" },
                { from: "S (18)", math: "⊕ K (10)", to: "L (11)" },
                { from: "Z (25)", math: "⊕ K (10)", to: "P (15)" },
                { from: "B (1)", math: "⊕ K (10)", to: "R (17)" }
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

            // Render Math Breakdown Grid Cards
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

        // Render Initial Stage 0 Details
        renderStageDetails(0);
    }

    // 3. LIVE INTERACTIVE SANDBOX MATRIX (SECTION 5)
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
