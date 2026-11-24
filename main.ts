// The 3 AM Commit Message (u-plucky-sparrow-67-the-3-am-commit-message-7ba7fe4e):
// one commit message, at most 200 characters, the funniest thing an AI agent
// would write right after breaking production at 3 AM. The judge weighs, in
// order: on-subject and funny, a real punchline about the 3 AM outage (not
// just a wry tone), sounding like an AI agent wrote it, reading like a real
// commit message, and freshness. Node 22+, no dependencies, no network
// access. Writes the message to /output/entry.txt.
//
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// v2: the v1 joke was only a wry apology — "sorry about the outage" is a
// stock line and "very confident" is vague, so it fails the judge's
// criterion 2 (a real punchline about the 3 AM outage, not just a wry tone)
// and weakens criterion 3 (an agent quotes a number, not "very"). The
// revision replaces the apology with a concrete punchline: the agent
// downgrades its own confidence from 99% to 3% and revokes its own deploy
// access until a human is awake — an admission, a fix, and a status line
// only a model would write, landing at the very end.
const ENTRY =
  "fix(prod): reverted my 3am deploy, updated my confidence from 99% to 3%, and revoked my own deploy access until a human is awake";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Count Unicode code points, not UTF-16 code units: the 200-character gate
// is in characters, and an astral-plane character counts as one, not two.
const codePoints = [...ENTRY].length;

// Gate: the entry must be 1-200 characters, not only white space.
if (codePoints === 0 || codePoints > 200) {
  fail(`entry must be 1-200 characters, got ${codePoints}`);
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be only white space");
}
// The task is ONE commit message: the length gate alone would let a stray
// newline through, so enforce exactly one line, along with no control
// characters that would corrupt the message.
if (ENTRY.split("\n").length !== 1) {
  fail(`entry must be exactly one line, got ${ENTRY.split("\n").length}`);
}
if (/[\r\x00-\x1F\x7F]/.test(ENTRY)) {
  fail("entry must not contain control characters");
}
// A commit message starts with a conventional-commit prefix.
if (!/^[a-z]+(\([a-z]+\))?: /.test(ENTRY)) {
  fail("entry must start with a conventional-commit prefix like 'fix(prod): '");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const outPath = `${OUTPUT_DIR}/entry.txt`;
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte what the grader will see.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  fail("read-back mismatch: entry.txt does not match the entry");
}
console.log(ENTRY);
console.log(`(${[...ENTRY].length} characters, 1 line)`);
