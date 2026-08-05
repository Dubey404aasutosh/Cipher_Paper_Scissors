/**
 * CIPHER, PAPER, SCISSORS (CPS-25) — Cryptographic Engine
 * Team: GreekGods (Aasutosh, Harshit, Kapil)
 *
 * All three stages operate on the SAME 25-letter Playfair alphabet
 * (A-I, K-Z — no J, which merges with I).  This guarantees every
 * stage is a true bijection and decrypt(encrypt(x)) === x  ALWAYS.
 *
 *  1. SHIFT  (Caesar):    index′ = (index ± shift) mod 25
 *  2. SWAP   (Playfair):  length-preserving 5×5 matrix substitution
 *  3. FLIP   (Vigenère):  index′ = (index ± keyIndex) mod 25
 */

const CPSCipher = (function () {

    // 25-letter alphabet (standard Playfair — J merges with I)
    const ALPHA = "ABCDEFGHIKLMNOPQRSTUVWXYZ";   // length 25

    /**
     * Sanitise: uppercase, J→I, strip non-letters.
     */
    function cleanText(text) {
        if (!text) return "";
        return text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Stage 1 — SHIFT  (Caesar on 25-letter alphabet)
    // ═══════════════════════════════════════════════════════════════════
    function caesarTransform(text, shiftAmount, decrypt = false) {
        const cleaned = cleanText(text);
        const s = ((parseInt(shiftAmount, 10) || 0) % 25 + 25) % 25;
        const eff = decrypt ? (25 - s) % 25 : s;
        let out = "";
        for (const ch of cleaned) {
            const i = ALPHA.indexOf(ch);
            out += i === -1 ? ch : ALPHA[(i + eff) % 25];
        }
        return out;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Stage 2 — SWAP  (Playfair 5×5)
    // ═══════════════════════════════════════════════════════════════════

    function generatePlayfairMatrix(key) {
        const k = cleanText(key) || "ZEUS";
        const used = new Set();
        const flat = [];
        for (const ch of k)     if (!used.has(ch)) { used.add(ch); flat.push(ch); }
        for (const ch of ALPHA) if (!used.has(ch)) { used.add(ch); flat.push(ch); }
        const grid = [];
        for (let r = 0; r < 5; r++) grid.push(flat.slice(r * 5, (r + 1) * 5));
        return { flat, grid };
    }

    function findPos(flat, ch) {
        const i = flat.indexOf(ch);
        return i === -1 ? { r: 0, c: 0 } : { r: Math.floor(i / 5), c: i % 5 };
    }

    /**
     * Length-preserving Playfair:
     *  • Pairs consecutive characters — NO filler insertion for duplicates.
     *  • Odd trailing character gets a diagonal matrix shift.
     *  • Duplicate pairs naturally use the "same-row" rule → fully invertible.
     */
    function playfairTransform(text, key, decrypt = false) {
        const cleaned = cleanText(text);
        const mat  = generatePlayfairMatrix(key);
        const flat = mat.flat, grid = mat.grid;
        const step = decrypt ? 4 : 1;

        // Build pairs — no fillers, no padding
        const pairs = [];
        let idx = 0;
        while (idx < cleaned.length) {
            if (idx + 1 < cleaned.length) {
                pairs.push([cleaned[idx], cleaned[idx + 1]]);
                idx += 2;
            } else {
                pairs.push([cleaned[idx]]);
                idx += 1;
            }
        }

        let result = "";
        for (const pair of pairs) {
            if (pair.length === 2) {
                const a = findPos(flat, pair[0]);
                const b = findPos(flat, pair[1]);
                let r1 = a.r, c1 = a.c, r2 = b.r, c2 = b.c;

                if (r1 === r2) {
                    c1 = (c1 + step) % 5;
                    c2 = (c2 + step) % 5;
                } else if (c1 === c2) {
                    r1 = (r1 + step) % 5;
                    r2 = (r2 + step) % 5;
                } else {
                    const tmp = c1; c1 = c2; c2 = tmp;
                }
                result += grid[r1][c1] + grid[r2][c2];
            } else {
                const a = findPos(flat, pair[0]);
                result += grid[(a.r + step) % 5][(a.c + step) % 5];
            }
        }

        return { result, matrix: grid, digraphs: pairs };
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Stage 3 — FLIP  (Vigenère-style modular addition on 25 letters)
    //
    //  Encrypt:  C = (P + K) mod 25
    //  Decrypt:  P = (C − K + 25) mod 25
    // ═══════════════════════════════════════════════════════════════════

    function letterXORSingle(pIdx, kIdx, decrypt = false) {
        return decrypt
            ? (pIdx - kIdx + 25) % 25
            : (pIdx + kIdx) % 25;
    }

    function xorTransform(text, xorKey, decrypt = false) {
        const ct = cleanText(text);
        const ck = cleanText(xorKey) || "K";
        let out = "";
        for (let i = 0; i < ct.length; i++) {
            const pi = ALPHA.indexOf(ct[i]);
            const ki = ALPHA.indexOf(ck[i % ck.length]);
            out += (pi !== -1 && ki !== -1)
                ? ALPHA[letterXORSingle(pi, ki, decrypt)]
                : ct[i];
        }
        return out;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Full Pipelines
    // ═══════════════════════════════════════════════════════════════════

    function encrypt(plaintext, playfairKey = "ZEUS", caesarShift = 3, xorKey = "K") {
        const clean = cleanText(plaintext);
        const s1    = caesarTransform(clean, caesarShift, false);
        const s2    = playfairTransform(s1, playfairKey, false);
        const s3    = xorTransform(s2.result, xorKey, false);
        return {
            plaintext:       clean,
            stage1_shift:    s1,
            stage2_swap:     s2.result,
            stage2_digraphs: s2.digraphs,
            playfair_matrix: s2.matrix,
            stage3_flip:     s3,
            keys: { caesarShift, playfairKey, xorKey }
        };
    }

    function decrypt(ciphertext, playfairKey = "ZEUS", caesarShift = 3, xorKey = "K") {
        const clean = cleanText(ciphertext);
        const u3    = xorTransform(clean, xorKey, true);
        const u2    = playfairTransform(u3, playfairKey, true);
        const u1    = caesarTransform(u2.result, caesarShift, true);
        return {
            ciphertext:          clean,
            unflip_swap:         u3,
            unswap_shift:        u2.result,
            recovered_plaintext: u1
        };
    }

    return {
        cleanText, caesarTransform, generatePlayfairMatrix,
        playfairTransform, letterXORSingle, xorTransform,
        encrypt, decrypt
    };
})();
