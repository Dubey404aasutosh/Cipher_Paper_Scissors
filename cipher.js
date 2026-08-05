/**
 * CIPHER, PAPER, SCISSORS (CPS-26) — Cryptographic Engine
 * Team: GreekGods (Aasutosh, Harshit, Kapil)
 *
 * Full 26-letter Alphabet Engine (A-Z, including J).
 * All 3 stages operate over Z_26, ensuring decrypt(encrypt(x)) === x EXACTLY
 * for ALL 26 English letters without replacing J with I.
 *
 *  1. SHIFT  (Caesar):    index′ = (index ± shift) mod 26
 *  2. SWAP   (Playfair):  2×13 matrix substitution (all 26 letters preserved)
 *  3. FLIP   (Vigenère):  index′ = (index ± keyIndex) mod 26
 */

const CPSCipher = (function () {

    // Full 26-letter English alphabet (supports J natively!)
    const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // length 26

    /**
     * Clean input text: uppercase, strip non-alphabet characters (preserves J).
     */
    function cleanText(text) {
        if (!text) return "";
        return text.toUpperCase().replace(/[^A-Z]/g, "");
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Stage 1 — SHIFT (Caesar Cipher on 26-letter alphabet)
    // ═══════════════════════════════════════════════════════════════════
    function caesarTransform(text, shiftAmount, decrypt = false) {
        const cleaned = cleanText(text);
        const s = ((parseInt(shiftAmount, 10) || 0) % 26 + 26) % 26;
        const eff = decrypt ? (26 - s) % 26 : s;
        let out = "";
        for (const ch of cleaned) {
            const i = ALPHA.indexOf(ch);
            out += i === -1 ? ch : ALPHA[(i + eff) % 26];
        }
        return out;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Stage 2 — SWAP (2×13 Playfair Matrix Cipher for all 26 letters)
    // ═══════════════════════════════════════════════════════════════════
    function generatePlayfairMatrix(key) {
        const k = cleanText(key) || "ZEUS";
        const used = new Set();
        const flat = [];
        for (const ch of k)     if (!used.has(ch)) { used.add(ch); flat.push(ch); }
        for (const ch of ALPHA) if (!used.has(ch)) { used.add(ch); flat.push(ch); }
        const grid = [];
        for (let r = 0; r < 2; r++) grid.push(flat.slice(r * 13, (r + 1) * 13));
        return { flat, grid };
    }

    function findPos(flat, ch) {
        const i = flat.indexOf(ch);
        return i === -1 ? { r: 0, c: 0 } : { r: Math.floor(i / 13), c: i % 13 };
    }

    /**
     * Length-preserving 2×13 Playfair Transformation:
     *  • Processes pairs of letters in a 2-row × 13-column matrix.
     *  • Same Row: shift column (+1 for Encrypt, +12 for Decrypt mod 13).
     *  • Same Col: swap row ((r + 1) mod 2).
     *  • Rectangle: swap columns.
     *  • Single trailing char: shift column and swap row.
     */
    function playfairTransform(text, key, decrypt = false) {
        const cleaned = cleanText(text);
        const mat  = generatePlayfairMatrix(key);
        const flat = mat.flat, grid = mat.grid;
        const stepCol = decrypt ? 12 : 1;

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
                    c1 = (c1 + stepCol) % 13;
                    c2 = (c2 + stepCol) % 13;
                } else if (c1 === c2) {
                    r1 = (r1 + 1) % 2;
                    r2 = (r2 + 1) % 2;
                } else {
                    const tmp = c1; c1 = c2; c2 = tmp;
                }
                result += grid[r1][c1] + grid[r2][c2];
            } else {
                const a = findPos(flat, pair[0]);
                result += grid[(a.r + 1) % 2][(a.c + stepCol) % 13];
            }
        }

        return { result, matrix: grid, digraphs: pairs };
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Stage 3 — FLIP (Vigenère Modular Addition/Subtraction on Z_26)
    //
    //  Encrypt: C = (P + K) mod 26
    //  Decrypt: P = (C - K + 26) mod 26
    // ═══════════════════════════════════════════════════════════════════
    function letterXORSingle(pIdx, kIdx, decrypt = false) {
        return decrypt
            ? (pIdx - kIdx + 26) % 26
            : (pIdx + kIdx) % 26;
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

    /**
     * Format Preservation Helpers (preserves casing, spaces, digits, and special symbols)
     */
    function extractFormatMask(text) {
        if (!text) return { letters: "", mask: [] };
        let letters = "";
        let mask = [];
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (/[a-zA-Z]/.test(ch)) {
                letters += ch.toUpperCase();
                mask.push({ isLetter: true, isLower: ch >= 'a' && ch <= 'z' });
            } else {
                mask.push({ isLetter: false, char: ch });
            }
        }
        return { letters, mask };
    }

    function applyFormatMask(letters, mask) {
        let out = "";
        let letterIdx = 0;
        for (const item of mask) {
            if (item.isLetter) {
                if (letterIdx < letters.length) {
                    const l = letters[letterIdx++];
                    out += item.isLower ? l.toLowerCase() : l;
                }
            } else {
                out += item.char;
            }
        }
        // Append remaining letters if cipher expanded (e.g. odd length padding)
        while (letterIdx < letters.length) {
            out += letters[letterIdx++];
        }
        return out;
    }

    // ═══════════════════════════════════════════════════════════════════
    //  Full Encryption and Decryption Pipelines
    // ═══════════════════════════════════════════════════════════════════
    function encrypt(plaintext, playfairKey = "ZEUS", caesarShift = 3, xorKey = "K", preserveFormat = true) {
        const fmt = extractFormatMask(plaintext);
        const clean = fmt.letters;
        const s1    = caesarTransform(clean, caesarShift, false);
        const s2    = playfairTransform(s1, playfairKey, false);
        const s3    = xorTransform(s2.result, xorKey, false);

        const finalCiphertext = preserveFormat ? applyFormatMask(s3, fmt.mask) : s3;

        return {
            plaintext:       clean,
            rawInput:        plaintext,
            stage1_shift:    s1,
            stage2_swap:     s2.result,
            stage2_digraphs: s2.digraphs,
            playfair_matrix: s2.matrix,
            stage3_flip:     s3,
            finalCiphertext: finalCiphertext,
            keys: { caesarShift, playfairKey, xorKey }
        };
    }

    function decrypt(ciphertext, playfairKey = "ZEUS", caesarShift = 3, xorKey = "K", preserveFormat = true) {
        const fmt = extractFormatMask(ciphertext);
        const clean = fmt.letters;
        const u3    = xorTransform(clean, xorKey, true);
        const u2    = playfairTransform(u3, playfairKey, true);
        const u1    = caesarTransform(u2.result, caesarShift, true);

        const finalPlaintext = preserveFormat ? applyFormatMask(u1, fmt.mask) : u1;

        return {
            ciphertext:          clean,
            rawInput:            ciphertext,
            unflip_swap:         u3,
            unswap_shift:        u2.result,
            recovered_plaintext: finalPlaintext
        };
    }

    return {
        cleanText,
        caesarTransform,
        generatePlayfairMatrix,
        playfairTransform,
        letterXORSingle,
        xorTransform,
        encrypt,
        decrypt
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = CPSCipher;
}

