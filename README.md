# Cipher, Paper, Scissors (CPS-25)

A hybrid encryption algorithm combining **Caesar Cipher**, **Playfair Cipher**, and a **Vigenère-style modular shift**, built as a course assignment on classical cryptography.

**Team GreekGods:** Aasutosh, Harshit, Kapil

---

## Overview

CPS-25 layers three classical cipher techniques into a single pipeline. Every stage operates on the same 25-letter alphabet (`A–I, K–Z`, with `J` merged into `I`, as in standard Playfair), which keeps the whole pipeline length-preserving and guarantees `decrypt(encrypt(x)) === x`.

The name is a nod to the three operations involved:

| Move | Classical Cipher | What it does |
|---|---|---|
| **Shift** | Caesar | Adds a fixed numeric key to every letter's position |
| **Swap** | Playfair | Substitutes letter pairs using a 5×5 keyword matrix |
| **Flip** | Vigenère-style | Adds a repeating keyword's letter values to the result |

---

## Algorithm

### Encryption
1. Clean the plaintext — uppercase, convert `J → I`, strip non-letters.
2. **Shift:** `index' = (index + shift) mod 25` for every letter.
3. Pair up consecutive letters (no filler characters needed).
4. **Swap:** encrypt each pair with the Playfair matrix — same row → shift column, same column → shift row, otherwise swap columns.
5. **Flip:** `index' = (index + keyIndex) mod 25`, cycling the key across the text.
6. Output the result as ciphertext.

### Decryption
1. Clean the ciphertext.
2. **Undo Flip:** `index' = (index - keyIndex + 25) mod 25`.
3. **Undo Swap:** apply inverse Playfair rules with the same matrix.
4. **Undo Shift:** `index' = (index - shift + 25) mod 25`.
5. Output the recovered plaintext.

> **Note:** Any original `J` in the plaintext will come back as `I`. This is an inherent limitation of the Playfair cipher (25-letter grid can't hold 26 letters) — not a bug in this implementation.

---

## Why It's Stronger Than Caesar Alone

A plain Caesar cipher has only 26 possible keys and preserves letter-frequency patterns, so it's broken almost instantly by frequency analysis or brute force. CPS-25 combines three distinct operations, so an attacker has to break all three layers together, not guess a single number. The Playfair stage alone defeats single-letter frequency analysis by encrypting pairs instead of individual letters, and the final Flip stage re-shifts the result again, so patterns surviving the first two stages don't carry through to the final ciphertext.

---

## Files

| File | Description |
|---|---|
| `cps25.js` | JavaScript implementation (`CPSCipher` module) — encryption, decryption, and matrix generation |
| `caesar_playfair_xor.c` | C implementation of an earlier byte/hex-based variant of the pipeline |
| `cps25_flow_diagram.svg` | Visual flowchart of the encryption and decryption pipelines |
| `README.md` | This file |

---

## Usage (JavaScript)

```js
const enc = CPSCipher.encrypt("MEET ME LATER", "ZEUS", 3, "K");
console.log(enc.stage3_flip); // ciphertext

const dec = CPSCipher.decrypt(enc.stage3_flip, "ZEUS", 3, "K");
console.log(dec.recovered_plaintext); // recovered plaintext
```

Parameters: `playfairKey` (default `"ZEUS"`), `caesarShift` (default `3`), `xorKey` (default `"K"`).

---

## Example

| Stage | Value |
|---|---|
| Plaintext | `MEET ME LATER` |
| Cleaned | `MEETMELATER` |
| Shift | `PHHWPHODWHU` |
| Swap | (Playfair-encrypted pairs) |
| **Ciphertext** | Depends on chosen keys — run `CPSCipher.encrypt()` to generate |
| **Recovered Plaintext** | `MEETMELATER` |

---

## License

Educational project — for coursework submission.
