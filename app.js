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
                    y: 0,
                    transformOrigin: "bottom left",
                    filter: "drop-shadow(0 4px 28px rgba(0,0,0,0.45))",
                },
                {
                    scaleY: 2.6,
                    y: -30,
                    filter: "drop-shadow(0 24px 48px rgba(0, 0, 0, 0.85))",
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: heroSection,
                        start: "top top",
                        end: "bottom 20%",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }
            );

            if (spotlightBox) {
                gsap.fromTo(
                    spotlightBox,
                    { scale: 1, y: 0 },
                    {
                        scale: 1.05,
                        y: 40,
                        ease: "none",
                        scrollTrigger: {
                            trigger: heroSection,
                            start: "top top",
                            end: "bottom top",
                            scrub: 0.3,
                        },
                    }
                );
            }
        }

        // 2. PLAINTEXT JOURNEY SCROLL ANIMATION & DETAILED STEP-BY-STEP CRYPTO MATH
        const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const sampleWord = "GREEKGODS";
        const playfairKey = "ZEUS";
        const caesarShift = 3;
        const xorKey = "K";

        let currentJourneyWord = sampleWord;

        function computeCryptoJourney(word, pKey = playfairKey, cShift = caesarShift, xKey = xorKey) {
            const clean = CPSCipher.cleanText(word) || "GREEKGODS";
            const enc = CPSCipher.encrypt(clean, pKey, cShift, xKey);

            // Stage 0: Plaintext index mapping
            const s0Math = [];
            for (let ch of clean) {
                const idx = ALPHA.indexOf(ch);
                s0Math.push({ from: ch, math: `Index ${idx}`, to: `${idx}` });
            }

            // Stage 1: Shift (+cShift mod 26)
            const s1Math = [];
            for (let i = 0; i < clean.length; i++) {
                const origCh = clean[i];
                const pIdx = ALPHA.indexOf(origCh);
                const sCh = enc.stage1_shift[i];
                const sIdx = ALPHA.indexOf(sCh);
                s1Math.push({ from: `${origCh} (${pIdx})`, math: `+ ${cShift} mod 26`, to: `${sCh} (${sIdx})` });
            }

            // Stage 2: Swap (Playfair 2x13 Digraphs)
            const s2Math = [];
            const digraphs = enc.stage2_digraphs || [];
            let resIdx = 0;
            digraphs.forEach((pairArr, pIdx) => {
                const pairStr = pairArr.join("");
                const swappedStr = enc.stage2_swap.substring(resIdx, resIdx + pairArr.length);
                resIdx += pairArr.length;
                s2Math.push({ from: `Pair ${pIdx + 1}: ${pairStr}`, math: "Matrix Swap", to: swappedStr });
            });

            // Stage 3: Flip (+K mod 26)
            const s3Math = [];
            const kIdx = ALPHA.indexOf(xKey);
            for (let i = 0; i < enc.stage2_swap.length; i++) {
                const s2Ch = enc.stage2_swap[i];
                const s2i = ALPHA.indexOf(s2Ch);
                const s3Ch = enc.stage3_flip[i];
                const s3i = ALPHA.indexOf(s3Ch);
                s3Math.push({ from: `${s2Ch} (${s2i})`, math: `+ ${xKey} (${kIdx}) mod 26`, to: `${s3Ch} (${s3i})` });
            }

            const stageFormulas = [
                `FORMULA: P = [${clean.split("").join(", ")}]`,
                `FORMULA: C₁ = (P + ${cShift}) mod 26`,
                `FORMULA: 2×13 Matrix Swap [Key: ${pKey}]`,
                `FORMULA: C₃ = (C₂ + ${xKey}) mod 26`
            ];

            const stageDescs = [
                `Raw input '${clean}' converted to 26-letter index vectors [0-25] preserving all English letters natively.`,
                `Each letter index rotated forward by Caesar key k₁ = ${cShift} (mod 26) to pre-whiten frequency distribution.`,
                `Text split into digraphs & substituted using 2×13 Playfair matrix [Key: ${pKey}] for polygraphic defense.`,
                `Applies modular key addition (+${xKey}, index ${kIdx}) mod 26 yielding final ciphertext '${enc.stage3_flip}'.`
            ];

            return {
                enc,
                stageTexts: [clean, enc.stage1_shift, enc.stage2_swap, enc.stage3_flip],
                stageMathData: [s0Math, s1Math, s2Math, s3Math],
                stageFormulas,
                stageDescs
            };
        }

        let journeyData = computeCryptoJourney(sampleWord);

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
        renderLetterCells(journeyData.enc.plaintext);

        const stageTitles = [
            "STAGE 0: ORIGINAL PLAINTEXT",
            "STAGE 1: SHIFT (CAESAR +3)",
            "STAGE 2: SWAP (PLAYFAIR 5x5)",
            "STAGE 3: FLIP (LETTER XOR)"
        ];

        const stageStepTags = [
            "INPUT STAGE",
            "MOVE 1 OF 3",
            "MOVE 2 OF 3",
            "MOVE 3 OF 3 (FINAL)"
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
            if (stageFormulaEl) stageFormulaEl.innerText = journeyData.stageFormulas[stageIdx];
            if (stageStepTagEl) stageStepTagEl.innerText = stageStepTags[stageIdx];
            if (stageDescEl) stageDescEl.innerText = journeyData.stageDescs[stageIdx];

            if (stageMathGridEl) {
                stageMathGridEl.innerHTML = "";
                const items = journeyData.stageMathData[stageIdx];
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
    const encInputText = document.getElementById("enc-input-text");
    const encShiftKey = document.getElementById("enc-shift-key");
    const encMatrixKey = document.getElementById("enc-matrix-key");
    const encXorKey = document.getElementById("enc-xor-key");

    const encResInput = document.getElementById("enc-res-input");
    const encResShift = document.getElementById("enc-res-shift");
    const encResSwap = document.getElementById("enc-res-swap");
    const encResFinal = document.getElementById("enc-res-final");

    const encActionBtn = document.getElementById("enc-action-btn");
    const encClearBtn = document.getElementById("enc-clear-btn");

    function runEncryptionPanel() {
        if (!encInputText || typeof CPSCipher === "undefined") return;

        const rawText = encInputText.value.trim();
        const sKey = parseInt(encShiftKey ? encShiftKey.value : 3, 10) || 0;
        const mKey = (encMatrixKey ? encMatrixKey.value.trim() : "ZEUS") || "ZEUS";
        const xKey = (encXorKey ? encXorKey.value.trim() : "K") || "K";

        const rowInput = encResInput ? encResInput.parentElement : null;
        const rowShift = encResShift ? encResShift.parentElement : null;
        const rowSwap = encResSwap ? encResSwap.parentElement : null;
        const rowFinal = encResFinal ? encResFinal.parentElement : null;

        if (!rawText) {
            if (encResInput) encResInput.innerText = "-";
            if (encResShift) encResShift.innerText = "-";
            if (encResSwap) encResSwap.innerText = "-";
            if (encResFinal) encResFinal.innerText = "-";

            if (rowInput) rowInput.setAttribute("data-tooltip", "1. SANITIZATION:\n• Converts to uppercase\n• Strips non-letters\n• Maps to full 26-letter alphabet [0-25] (preserves J natively)");
            if (rowShift) rowShift.setAttribute("data-tooltip", `2. CAESAR SHIFT (+${sKey}):\n• Formula: C₁ = (P + ${sKey}) mod 25\n• Rotates each letter index forward by ${sKey}.`);
            if (rowSwap) rowSwap.setAttribute("data-tooltip", `3. PLAYFAIR 5x5 [Key: ${mKey}]:\n• Pairs into digraphs\n• Substitutes via 5x5 matrix to eliminate single-letter frequency.`);
            if (rowFinal) rowFinal.setAttribute("data-tooltip", `4. LETTER XOR [Key: ${xKey}]:\n• Formula: C₃ = (C₂ + index('${xKey}')) mod 25\n• Final polyalphabetic encryption.`);
            return;
        }

        const res = CPSCipher.encrypt(rawText, mKey, sKey, xKey);
        if (encResInput) encResInput.innerText = res.plaintext;
        if (encResShift) encResShift.innerText = res.stage1_shift;
        if (encResSwap) encResSwap.innerText = res.stage2_swap;
        if (encResFinal) encResFinal.innerText = res.finalCiphertext || res.stage3_flip;

        // Build detailed math breakdowns
        const ALPHA = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
        
        // Caesar breakdown
        let caesarSteps = [];
        for (let i = 0; i < res.plaintext.length; i++) {
            const pCh = res.plaintext[i];
            const pIdx = ALPHA.indexOf(pCh);
            const cCh = res.stage1_shift[i];
            const cIdx = ALPHA.indexOf(cCh);
            caesarSteps.push(`${pCh}(${pIdx}) + ${sKey} = ${cIdx} → ${cCh}`);
        }

        // Playfair breakdown
        let playfairSteps = [];
        const digraphs = res.stage2_digraphs || [];
        let resIdx = 0;
        digraphs.forEach((pairArr, pIdx) => {
            const pairStr = pairArr.join("");
            const swappedStr = res.stage2_swap.substring(resIdx, resIdx + pairArr.length);
            resIdx += pairArr.length;
            playfairSteps.push(`Pair ${pIdx + 1}: ${pairStr} → Matrix Swap → ${swappedStr}`);
        });

        // XOR breakdown
        let xorSteps = [];
        const kIdx = ALPHA.indexOf(xKey[0] || "K");
        for (let i = 0; i < res.stage2_swap.length; i++) {
            const s2Ch = res.stage2_swap[i];
            const s2Idx = ALPHA.indexOf(s2Ch);
            const s3Ch = res.stage3_flip[i];
            const s3Idx = ALPHA.indexOf(s3Ch);
            xorSteps.push(`${s2Ch}(${s2Idx}) + ${xKey}(${kIdx}) = ${s3Idx} → ${s3Ch}`);
        }

        if (rowInput) rowInput.setAttribute("data-tooltip", `1. SANITIZED PLAINTEXT: '${res.plaintext}'\n• J converted to I\n• Length: ${res.plaintext.length} letters`);
        if (rowShift) rowShift.setAttribute("data-tooltip", `2. CAESAR SHIFT (Shift: ${sKey}):\n${caesarSteps.slice(0, 4).join("\n")}${caesarSteps.length > 4 ? "\n..." : ""}`);
        if (rowSwap) rowSwap.setAttribute("data-tooltip", `3. PLAYFAIR 5x5 [Key: ${mKey}]:\n${playfairSteps.join("\n")}`);
        if (rowFinal) rowFinal.setAttribute("data-tooltip", `4. LETTER XOR [Key: ${xKey} (idx ${kIdx})]:\n${xorSteps.slice(0, 4).join("\n")}${xorSteps.length > 4 ? "\n..." : ""}`);
    }

    if (encInputText) encInputText.addEventListener("input", runEncryptionPanel);
    if (encShiftKey) encShiftKey.addEventListener("input", runEncryptionPanel);
    if (encMatrixKey) encMatrixKey.addEventListener("input", runEncryptionPanel);
    if (encXorKey) encXorKey.addEventListener("input", runEncryptionPanel);
    if (encActionBtn) encActionBtn.addEventListener("click", runEncryptionPanel);
    if (encClearBtn) {
        encClearBtn.addEventListener("click", () => {
            if (encInputText) encInputText.value = "";
            runEncryptionPanel();
        });
    }

    // DECRYPTION PANEL
    const decInputText = document.getElementById("dec-input-text");
    const decShiftKey = document.getElementById("dec-shift-key");
    const decMatrixKey = document.getElementById("dec-matrix-key");
    const decXorKey = document.getElementById("dec-xor-key");

    const decResInput = document.getElementById("dec-res-input");
    const decResUnflip = document.getElementById("dec-res-unflip");
    const decResUnswap = document.getElementById("dec-res-unswap");
    const decResFinal = document.getElementById("dec-res-final");

    const decActionBtn = document.getElementById("dec-action-btn");
    const decClearBtn = document.getElementById("dec-clear-btn");

    function runDecryptionPanel() {
        if (!decInputText || typeof CPSCipher === "undefined") return;

        const rawText = decInputText.value.trim();
        const sKey = parseInt(decShiftKey ? decShiftKey.value : 3, 10) || 0;
        const mKey = (decMatrixKey ? decMatrixKey.value.trim() : "ZEUS") || "ZEUS";
        const xKey = (decXorKey ? decXorKey.value.trim() : "K") || "K";

        const rowInput = decResInput ? decResInput.parentElement : null;
        const rowUnflip = decResUnflip ? decResUnflip.parentElement : null;
        const rowUnswap = decResUnswap ? decResUnswap.parentElement : null;
        const rowFinal = decResFinal ? decResFinal.parentElement : null;

        if (!rawText) {
            if (decResInput) decResInput.innerText = "-";
            if (decResUnflip) decResUnflip.innerText = "-";
            if (decResUnswap) decResUnswap.innerText = "-";
            if (decResFinal) decResFinal.innerText = "-";

            if (rowInput) rowInput.setAttribute("data-tooltip", "1. INPUT CIPHERTEXT:\nEnter encrypted letters to reverse the 3 cipher stages.");
            if (rowUnflip) rowUnflip.setAttribute("data-tooltip", `2. REVERSE XOR [Key: ${xKey}]:\n• Formula: C₂ = (C₃ - index('${xKey}') + 25) mod 25`);
            if (rowUnswap) rowUnswap.setAttribute("data-tooltip", `3. REVERSE PLAYFAIR 5x5 [Key: ${mKey}]:\n• Inverse matrix shift (-1 step / row-col lookup).`);
            if (rowFinal) rowFinal.setAttribute("data-tooltip", `4. REVERSE CAESAR (-${sKey}):\n• Formula: P = (C₁ - ${sKey} + 25) mod 25\n• Recovers Plaintext.`);
            return;
        }

        const dec = CPSCipher.decrypt(rawText, mKey, sKey, xKey);
        if (decResInput) decResInput.innerText = dec.ciphertext;
        if (decResUnflip) decResUnflip.innerText = dec.unflip_swap;
        if (decResUnswap) decResUnswap.innerText = dec.unswap_shift;
        if (decResFinal) decResFinal.innerText = dec.recovered_plaintext;

        const ALPHA = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
        const kIdx = ALPHA.indexOf(xKey[0] || "K");

        let unxorSteps = [];
        for (let i = 0; i < dec.ciphertext.length; i++) {
            const cCh = dec.ciphertext[i];
            const cIdx = ALPHA.indexOf(cCh);
            const uCh = dec.unflip_swap[i];
            const uIdx = ALPHA.indexOf(uCh);
            unxorSteps.push(`${cCh}(${cIdx}) - ${xKey}(${kIdx}) = ${uIdx} → ${uCh}`);
        }

        let uncaesarSteps = [];
        for (let i = 0; i < dec.unswap_shift.length; i++) {
            const sCh = dec.unswap_shift[i];
            const sIdx = ALPHA.indexOf(sCh);
            const rCh = dec.recovered_plaintext[i];
            const rIdx = ALPHA.indexOf(rCh);
            uncaesarSteps.push(`${sCh}(${sIdx}) - ${sKey} = ${rIdx} → ${rCh}`);
        }

        if (rowInput) rowInput.setAttribute("data-tooltip", `1. INPUT CIPHERTEXT: '${dec.ciphertext}'\n• Length: ${dec.ciphertext.length} characters`);
        if (rowUnflip) rowUnflip.setAttribute("data-tooltip", `2. REVERSE XOR [Key: ${xKey} (idx ${kIdx})]:\n${unxorSteps.slice(0, 4).join("\n")}${unxorSteps.length > 4 ? "\n..." : ""}`);
        if (rowUnswap) rowUnswap.setAttribute("data-tooltip", `3. REVERSE PLAYFAIR 5x5 [Key: ${mKey}]:\n• Substituted '${dec.unflip_swap}' → Matrix Inverse → '${dec.unswap_shift}'.`);
        if (rowFinal) rowFinal.setAttribute("data-tooltip", `4. REVERSE CAESAR (Shift: -${sKey}):\n${uncaesarSteps.slice(0, 4).join("\n")}${uncaesarSteps.length > 4 ? "\n..." : ""}`);
    }

    if (decInputText) decInputText.addEventListener("input", runDecryptionPanel);
    if (decShiftKey) decShiftKey.addEventListener("input", runDecryptionPanel);
    if (decMatrixKey) decMatrixKey.addEventListener("input", runDecryptionPanel);
    if (decXorKey) decXorKey.addEventListener("input", runDecryptionPanel);
    if (decActionBtn) decActionBtn.addEventListener("click", runDecryptionPanel);
    if (decClearBtn) {
        decClearBtn.addEventListener("click", () => {
            if (decInputText) decInputText.value = "";
            runDecryptionPanel();
        });
    }

    runEncryptionPanel();
    runDecryptionPanel();

    // 4. INTERACTIVE MODAL POPUP FOR FULL ALGORITHM STEPS ON CLICK
    const algoModal = document.getElementById("algo-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBadge = document.getElementById("modal-badge");
    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalBody = document.getElementById("modal-body");

    function closeModal() {
        if (algoModal) algoModal.classList.remove("active");
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (algoModal) {
        algoModal.addEventListener("click", (e) => {
            if (e.target === algoModal) closeModal();
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    function openAlgoModal(stageType, stageTitle, subtitle, detailedHTML) {
        if (!algoModal || !modalBody) return;
        if (modalBadge) modalBadge.innerText = stageType;
        if (modalTitle) modalTitle.innerText = stageTitle;
        if (modalSubtitle) modalSubtitle.innerText = subtitle;
        modalBody.innerHTML = detailedHTML;
        algoModal.classList.add("active");
    }

    // Attach click handlers to all move-cards, stage-pills, and result-rows
    document.querySelectorAll(".move-card, .stage-pill, .result-row").forEach((elem) => {
        elem.addEventListener("click", () => {
            const isDecryptionContext = elem.closest(".decrypt-card") !== null || elem.innerText.includes("UN-");
            const ALPHA = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

            if (isDecryptionContext) {
                const rawText = (decInputText && decInputText.value.trim()) || "UFTQNTB";
                const sKey = parseInt(decShiftKey ? decShiftKey.value : 3, 10) || 3;
                const mKey = (decMatrixKey ? decMatrixKey.value.trim() : "ZEUS") || "ZEUS";
                const xKey = (decXorKey ? decXorKey.value.trim() : "K") || "K";

                const dec = CPSCipher.decrypt(rawText, mKey, sKey, xKey);

                if (elem.innerText.includes("UN-XOR") || elem.id === "dec-res-unflip") {
                    const kIdx = ALPHA.indexOf(xKey[0] || "K");
                    let unxorRows = "";
                    for (let i = 0; i < dec.ciphertext.length; i++) {
                        const cCh = dec.ciphertext[i];
                        const cIdx = ALPHA.indexOf(cCh);
                        const uCh = dec.unflip_swap[i];
                        const uIdx = ALPHA.indexOf(uCh);
                        unxorRows += `
                            <tr>
                                <td>Pos ${i + 1}</td>
                                <td>${cCh} (idx ${cIdx})</td>
                                <td>${xKey} (idx ${kIdx})</td>
                                <td>(${cIdx} - ${kIdx} + 25) mod 25 = ${uIdx}</td>
                                <td><strong>${uCh}</strong></td>
                            </tr>
                        `;
                    }

                    openAlgoModal(
                        "REVERSE STAGE 3: UN-XOR",
                        "XOR Key Subtraction Execution",
                        `Reverses modular key addition by subtracting Key '${xKey}' (index ${kIdx}) mod 25.`,
                        `
                        <div class="modal-section-title">Decryption Mathematical Formula</div>
                        <div class="modal-code-box">C₂ = (C₃ - K_index + 25) mod 25</div>
                        <div class="modal-text">
                            Subtracting key index ${kIdx} from ciphertext letter indices recovers intermediate Playfair characters.
                        </div>
                        <div class="modal-section-title">Character-by-Character Un-XOR Execution</div>
                        <table class="modal-math-table">
                            <thead>
                                <th>Pos</th>
                                <th>Ciphertext Letter</th>
                                <th>XOR Key Letter</th>
                                <th>Modular Index Subtraction</th>
                                <th>Un-XOR Output</th>
                            </thead>
                            <tbody>${unxorRows}</tbody>
                        </table>
                        <div class="modal-text">
                            <strong>Resulting Un-XOR String:</strong> <code>${dec.unflip_swap}</code>
                        </div>
                        `
                    );
                } else if (elem.innerText.includes("UN-PLAYFAIR") || elem.id === "dec-res-unswap") {
                    const mat = CPSCipher.generatePlayfairMatrix(mKey);
                    let gridHTML = `<table class="modal-math-table"><thead><tr><th colspan="5">5x5 Playfair Matrix Grid [Key: ${mKey}]</th></tr></thead><tbody>`;
                    mat.grid.forEach(row => {
                        gridHTML += `<tr>${row.map(cell => `<td><strong>${cell}</strong></td>`).join("")}</tr>`;
                    });
                    gridHTML += `</tbody></table>`;

                    openAlgoModal(
                        "REVERSE STAGE 2: UN-PLAYFAIR",
                        "Playfair 5×5 Inverse Matrix Substitution",
                        `Reverses digraph substitution using the 5×5 key matrix [Key: ${mKey}].`,
                        `
                        <div class="modal-section-title">Playfair Matrix Grid Setup</div>
                        ${gridHTML}
                        <div class="modal-section-title">Inverse Digraph Substitution Rules</div>
                        <div class="modal-code-box">Reverse Row/Col Shift (-1 step / modulo 5)</div>
                        <div class="modal-text">
                            1. <strong>Same Row:</strong> Shift 1 position LEFT (with wrap-around).<br>
                            2. <strong>Same Column:</strong> Shift 1 position UP (with wrap-around).<br>
                            3. <strong>Rectangle:</strong> Swap column coordinates (same as encryption).
                        </div>
                        <table class="modal-math-table">
                            <thead>
                                <tr>
                                    <th>Un-XOR Input String</th>
                                    <th>Playfair Inverse Lookup</th>
                                    <th>Recovered Un-Shift String</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>${dec.unflip_swap}</code></td>
                                    <td>Inverse Matrix Digraph Decoding</td>
                                    <td><strong><code>${dec.unswap_shift}</code></strong></td>
                                </tr>
                            </tbody>
                        </table>
                        `
                    );
                } else if (elem.innerText.includes("UN-CAESAR") || elem.id === "dec-res-final") {
                    let uncaesarRows = "";
                    for (let i = 0; i < dec.unswap_shift.length; i++) {
                        const sCh = dec.unswap_shift[i];
                        const sIdx = ALPHA.indexOf(sCh);
                        const rCh = dec.recovered_plaintext[i];
                        const rIdx = ALPHA.indexOf(rCh);
                        uncaesarRows += `
                            <tr>
                                <td>Pos ${i + 1}</td>
                                <td>${sCh} (idx ${sIdx})</td>
                                <td>Shift Key = ${sKey}</td>
                                <td>(${sIdx} - ${sKey} + 25) mod 25 = ${rIdx}</td>
                                <td><strong>${rCh}</strong></td>
                            </tr>
                        `;
                    }

                    openAlgoModal(
                        "REVERSE STAGE 1: UN-CAESAR",
                        "Caesar Reverse Shift Execution",
                        `Rotates letter indices backward by Shift Key -${sKey} mod 25 to recover Plaintext.`,
                        `
                        <div class="modal-section-title">Decryption Mathematical Formula</div>
                        <div class="modal-code-box">P = (C₁ - k₁ + 25) mod 25</div>
                        <div class="modal-section-title">Character-by-Character Un-Shift Computation</div>
                        <table class="modal-math-table">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Un-Swap Letter</th>
                                    <th>Shift Key</th>
                                    <th>Caesar Inverse Math (-${sKey})</th>
                                    <th>Recovered Plaintext Letter</th>
                                </tr>
                            </thead>
                            <tbody>${uncaesarRows}</tbody>
                        </table>
                        <div class="modal-text">
                            <strong>Successfully Recovered Original Plaintext:</strong> <code>${dec.recovered_plaintext}</code>
                        </div>
                        `
                    );
                } else {
                    openAlgoModal(
                        "CIPHERTEXT INPUT",
                        "Decryption Input Vector",
                        "Sanitizes input ciphertext before running reverse cipher stages.",
                        `
                        <div class="modal-text">
                            1. <strong>Input Ciphertext:</strong> <code>${dec.ciphertext}</code><br>
                            2. <strong>Pipeline Direction:</strong> Un-XOR (Stage 3) → Un-Playfair (Stage 2) → Un-Caesar (Stage 1)<br>
                            3. <strong>Original Plaintext Recovered:</strong> <code>${dec.recovered_plaintext}</code>
                        </div>
                        `
                    );
                }
                return;
            }

            // ENCRYPTION CONTEXT
            const rawText = (encInputText && encInputText.value.trim()) || "GUJARAT";
            const sKey = parseInt(encShiftKey ? encShiftKey.value : 3, 10) || 3;
            const mKey = (encMatrixKey ? encMatrixKey.value.trim() : "ZEUS") || "ZEUS";
            const xKey = (encXorKey ? encXorKey.value.trim() : "K") || "K";

            const res = CPSCipher.encrypt(rawText, mKey, sKey, xKey);

            if (elem.classList.contains("shift") || elem.id === "pill-1" || elem.innerHTML.includes("CAESAR")) {
                let tableRows = "";
                for (let i = 0; i < res.plaintext.length; i++) {
                    const pCh = res.plaintext[i];
                    const pIdx = ALPHA.indexOf(pCh);
                    const cCh = res.stage1_shift[i];
                    const cIdx = ALPHA.indexOf(cCh);
                    tableRows += `
                        <tr>
                            <td>Pos ${i + 1}</td>
                            <td>${pCh}</td>
                            <td>Index ${pIdx}</td>
                            <td>(${pIdx} + ${sKey}) mod 25 = ${cIdx}</td>
                            <td><strong>${cCh}</strong></td>
                        </tr>
                    `;
                }

                openAlgoModal(
                    "STAGE 1: SHIFT (CAESAR)",
                    "Caesar Cipher Algorithm Execution",
                    `Shifts every letter forward by Key = ${sKey} in the 25-letter alphabet.`,
                    `
                    <div class="modal-section-title">Mathematical Formula</div>
                    <div class="modal-code-box">C₁ = (P + k₁) mod 25</div>
                    <div class="modal-text">
                        Every character in input string <strong>'${res.plaintext}'</strong> is assigned its 0-24 index in the alphabet array <code>[A-I, K-Z]</code> (Notice 'J' is mapped to 'I').
                    </div>
                    <div class="modal-section-title">Character-by-Character Computation</div>
                    <table class="modal-math-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Plain Letter</th>
                                <th>Alpha Index</th>
                                <th>Caesar Math (+${sKey})</th>
                                <th>Shifted Output</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                    <div class="modal-text">
                        <strong>Resulting Pre-Whitened Text:</strong> <code>${res.stage1_shift}</code>
                    </div>
                    `
                );
            } else if (elem.classList.contains("swap") || elem.id === "pill-2" || elem.innerHTML.includes("PLAYFAIR")) {
                const mat = CPSCipher.generatePlayfairMatrix(mKey);
                let gridHTML = `<table class="modal-math-table"><thead><tr><th colspan="5">5x5 Playfair Grid [Key: ${mKey}]</th></tr></thead><tbody>`;
                mat.grid.forEach(row => {
                    gridHTML += `<tr>${row.map(cell => `<td><strong>${cell}</strong></td>`).join("")}</tr>`;
                });
                gridHTML += `</tbody></table>`;

                let pairRows = "";
                const digraphs = res.stage2_digraphs || [];
                let resIdx = 0;
                digraphs.forEach((pairArr, pIdx) => {
                    const pairStr = pairArr.join("");
                    const swappedStr = res.stage2_swap.substring(resIdx, resIdx + pairArr.length);
                    resIdx += pairArr.length;
                    pairRows += `
                        <tr>
                            <td>Digraph ${pIdx + 1}</td>
                            <td>${pairStr}</td>
                            <td>Matrix Rectangle / Line Substitution Rule</td>
                            <td><strong>${swappedStr}</strong></td>
                        </tr>
                    `;
                });

                openAlgoModal(
                    "STAGE 2: SWAP (PLAYFAIR)",
                    "Playfair 5×5 Matrix Substitution",
                    `Pairs shifted text into digraphs and substitutes them via a 5×5 grid.`,
                    `
                    <div class="modal-section-title">Playfair Matrix Setup</div>
                    ${gridHTML}
                    <div class="modal-section-title">Digraph Pair Substitutions</div>
                    <table class="modal-math-table">
                        <thead>
                            <tr>
                                <th>Pair No.</th>
                                <th>Input Pair</th>
                                <th>Matrix Rule Applied</th>
                                <th>Substituted Pair</th>
                            </tr>
                        </thead>
                        <tbody>${pairRows}</tbody>
                    </table>
                    <div class="modal-text">
                        <strong>Resulting Swapped Text:</strong> <code>${res.stage2_swap}</code>
                    </div>
                    `
                );
            } else if (elem.classList.contains("flip") || elem.id === "pill-3" || elem.innerHTML.includes("XOR")) {
                const kIdx = ALPHA.indexOf(xKey[0] || "K");
                let xorRows = "";
                for (let i = 0; i < res.stage2_swap.length; i++) {
                    const s2Ch = res.stage2_swap[i];
                    const s2Idx = ALPHA.indexOf(s2Ch);
                    const s3Ch = res.stage3_flip[i];
                    const s3Idx = ALPHA.indexOf(s3Ch);
                    xorRows += `
                        <tr>
                            <td>Pos ${i + 1}</td>
                            <td>${s2Ch} (idx ${s2Idx})</td>
                            <td>${xKey} (idx ${kIdx})</td>
                            <td>(${s2Idx} + ${kIdx}) mod 25 = ${s3Idx}</td>
                            <td><strong>${s3Ch}</strong></td>
                        </tr>
                    `;
                }

                openAlgoModal(
                    "STAGE 3: FLIP (LETTER XOR)",
                    "Modular Key Addition / Letter XOR",
                    `Combines intermediate characters with key letter '${xKey}' mod 25.`,
                    `
                    <div class="modal-section-title">Mathematical Formula</div>
                    <div class="modal-code-box">C₃ = (C₂ + K_index) mod 25</div>
                    <div class="modal-section-title">Character Key-Addition Execution</div>
                    <table class="modal-math-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Intermediate Letter</th>
                                <th>XOR Key Letter</th>
                                <th>Modular Index Addition</th>
                                <th>Final Ciphertext</th>
                            </tr>
                        </thead>
                        <tbody>${xorRows}</tbody>
                    </table>
                    <div class="modal-text">
                        <strong>Final Encrypted Ciphertext:</strong> <code>${res.stage3_flip}</code>
                    </div>
                    `
                );
            } else {
                openAlgoModal(
                    "PLAINTEXT INPUT",
                    "Input Preparation & Pre-Whiteness",
                    "Sanitizes input text before feeding into the 3 cryptographic stages.",
                    `
                    <div class="modal-section-title">Sanitization Function</div>
                    <div class="modal-code-box">cleanText(text) = text.toUpperCase().replace(/[^A-Z]/g, "")</div>
                    <div class="modal-text">
                        Converts input to uppercase letter vectors [0-25] preserving all 26 English letters natively (including J).<br>
                        <strong>Clean Vector:</strong> Input '${rawText}' becomes <strong>'${res.plaintext}'</strong>.
                    </div>
                    `
                );
            }
        });
    });
});
