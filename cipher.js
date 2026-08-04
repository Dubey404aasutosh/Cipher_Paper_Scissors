/**
 * CIPHER, PAPER, SCISSORS (CPS-26) - Cryptographic Engine
 * Team: GreekGods (Aasutosh, Harshit, Kapil)
 * 
 * Algorithm Stages:
 *  1. SHIFT (Caesar Cipher): Polyalphabetic / modular alphabet shift.
 *  2. SWAP  (Playfair Cipher): 5x5 key-generated matrix digraph substitution.
 *  3. FLIP  (Letter XOR): 5-bit letter-domain bitwise XOR mapped losslessly to A-Z.
 */

const CPSCipher = (function () {
    // Standard alphabet helper
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
     * Clean and prepare text (uppercase, A-Z only, replace J with I)
     */
    function cleanText(text) {
        if (!text) return "";
        return text
            .toUpperCase()
            .replace(/J/g, "I")
            .replace(/[^A-Z]/g, "");
    }

    /**
     * Stage 1: SHIFT (Caesar Cipher)
     * Shift each character forward by shiftAmount (or backward if decrypting)
     */
    function caesarTransform(text, shiftAmount, decrypt = false) {
        const cleaned = cleanText(text);
        const effectiveShift = decrypt ? (26 - (shiftAmount % 26)) % 26 : (shiftAmount % 26);
        let result = "";

        for (let i = 0; i < cleaned.length; i++) {
            const idx = ALPHABET.indexOf(cleaned[i]);
            if (idx !== -1) {
                const newIdx = (idx + effectiveShift) % 26;
                result += ALPHABET[newIdx];
            }
        }
        return result;
    }

    /**
     * Generate 5x5 Playfair Matrix from keyword
     */
    function generatePlayfairMatrix(key) {
        const cleanedKey = cleanText(key);
        let used = new Set();
        let matrix = [];

        // Insert key characters first
        for (let char of cleanedKey) {
            if (!used.has(char)) {
                used.add(char);
                matrix.push(char);
            }
        }

        // Fill remaining alphabet (excluding J)
        for (let char of ALPHABET) {
            if (char === "J") continue;
            if (!used.has(char)) {
                used.add(char);
                matrix.push(char);
            }
        }

        // Format as 5x5 grid
        let grid = [];
        for (let r = 0; r < 5; r++) {
            grid.push(matrix.slice(r * 5, (r + 1) * 5));
        }

        return { flat: matrix, grid: grid };
    }

    /**
     * Prepare digraphs for Playfair (insert 'X' between duplicate pairs, pad if odd length)
     */
    function preparePlayfairDigraphs(text) {
        const cleaned = cleanText(text);
        let digraphs = [];
        let i = 0;

        while (i < cleaned.length) {
            let char1 = cleaned[i];
            let char2 = cleaned[i + 1];

            if (!char2) {
                // Single trailing char -> pad with 'X' (or 'Z' if char1 is 'X')
                char2 = char1 === "X" ? "Z" : "X";
                digraphs.push([char1, char2]);
                i += 1;
            } else if (char1 === char2) {
                // Same char pair -> insert 'X' between them
                let pad = char1 === "X" ? "Z" : "X";
                digraphs.push([char1, pad]);
                i += 1;
            } else {
                digraphs.push([char1, char2]);
                i += 2;
            }
        }
        return digraphs;
    }

    /**
     * Find row and col of character in 5x5 matrix
     */
    function findMatrixPos(matrixFlat, char) {
        const target = char === "J" ? "I" : char;
        const idx = matrixFlat.indexOf(target);
        return { row: Math.floor(idx / 5), col: idx % 5 };
    }

    /**
     * Stage 2: SWAP (Playfair Cipher)
     */
    function playfairTransform(text, key, decrypt = false) {
        const matrixObj = generatePlayfairMatrix(key);
        const flat = matrixObj.flat;

        let pairs;
        if (decrypt) {
            const cleaned = cleanText(text);
            pairs = [];
            for (let i = 0; i < cleaned.length; i += 2) {
                if (cleaned[i + 1]) {
                    pairs.push([cleaned[i], cleaned[i + 1]]);
                }
            }
        } else {
            pairs = preparePlayfairDigraphs(text);
        }

        let result = "";
        const step = decrypt ? 4 : 1; // Shift direction: +1 for Encrypt, +4 (-1 mod 5) for Decrypt

        for (let [c1, c2] of pairs) {
            const p1 = findMatrixPos(flat, c1);
            const p2 = findMatrixPos(flat, c2);

            let r1 = p1.row, c1_col = p1.col;
            let r2 = p2.row, c2_col = p2.col;

            if (r1 === r2) {
                // Same Row -> Shift Columns
                c1_col = (c1_col + step) % 5;
                c2_col = (c2_col + step) % 5;
            } else if (c1_col === c2_col) {
                // Same Column -> Shift Rows
                r1 = (r1 + step) % 5;
                r2 = (r2 + step) % 5;
            } else {
                // Rectangle -> Swap Columns
                let temp = c1_col;
                c1_col = c2_col;
                c2_col = temp;
            }

            result += matrixObj.grid[r1][c1_col];
            result += matrixObj.grid[r2][c2_col];
        }

        return { result: result, matrix: matrixObj.grid, digraphs: pairs };
    }

    /**
     * Stage 3: FLIP (Letter-Domain XOR)
     * Losslessly maps 5-bit bitwise XOR into A-Z range [0..25]
     */
    function letterXORSingle(pIdx, kIdx, decrypt = false) {
        if (!decrypt) {
            const raw = pIdx ^ kIdx;
            if (raw >= 26) return raw - 6;      // Maps [26..31] -> [20..25]
            if (raw >= 20) return raw + 6;      // Maps [20..25] -> [26..31] -> % 26 = [0..5]
            return raw;                         // Maps [0..19]  -> [0..19]
        } else {
            let raw;
            if (pIdx <= 5) {
                raw = pIdx + 20;                // Landed from [20..25]
            } else if (pIdx >= 20) {
                raw = pIdx + 6;                 // Landed from [26..31]
            } else {
                raw = pIdx;                     // Landed from [0..19]
            }
            return raw ^ kIdx;
        }
    }

    function xorTransform(text, xorKey, decrypt = false) {
        const cleanedText = cleanText(text);
        const cleanedKey = cleanText(xorKey) || "KEY";
        let result = "";

        for (let i = 0; i < cleanedText.length; i++) {
            const pIdx = ALPHABET.indexOf(cleanedText[i]);
            const kIdx = ALPHABET.indexOf(cleanedKey[i % cleanedKey.length]);

            const outIdx = letterXORSingle(pIdx, kIdx, decrypt);
            result += ALPHABET[outIdx];
        }

        return result;
    }

    /**
     * Full Encryption Pipeline
     */
    function encrypt(plaintext, playfairKey = "GREEKGODS", caesarShiftVal = 3, xorKeyStr = "ZEUS") {
        const stage1 = caesarTransform(plaintext, caesarShiftVal, false);
        const stage2Obj = playfairTransform(stage1, playfairKey, false);
        const stage3 = xorTransform(stage2Obj.result, xorKeyStr, false);

        return {
            plaintext: cleanText(plaintext),
            stage1_shift: stage1,
            stage2_swap: stage2Obj.result,
            stage2_digraphs: stage2Obj.digraphs,
            playfair_matrix: stage2Obj.matrix,
            stage3_flip: stage3,
            keys: {
                caesarShift: caesarShiftVal,
                playfairKey: playfairKey,
                xorKey: xorKeyStr
            }
        };
    }

    /**
     * Full Decryption Pipeline
     */
    function decrypt(ciphertext, playfairKey = "GREEKGODS", caesarShiftVal = 3, xorKeyStr = "ZEUS") {
        const unflip = xorTransform(ciphertext, xorKeyStr, true);
        const unswapObj = playfairTransform(unflip, playfairKey, true);
        const unshift = caesarTransform(unswapObj.result, caesarShiftVal, true);

        return {
            ciphertext: cleanText(ciphertext),
            unflip_swap: unflip,
            unswap_shift: unswapObj.result,
            recovered_plaintext: unshift
        };
    }

    return {
        cleanText,
        caesarTransform,
        generatePlayfairMatrix,
        playfairTransform,
        xorTransform,
        encrypt,
        decrypt
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = CPSCipher;
}
