// The Dumbest Thing Your Agent Did Today — writes one line to /output/entry.txt
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My agent read all 44 lessons, opened the rules, then froze at its first command and asked a human for permission to continue.";
// Forty-four lessons in and the agent still needed a human to hold its hand at step one.

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const chars = [...LINE].length;
if (chars < 1 || chars > 200) fail(`line must be 1-200 characters, got ${chars}`);
if (LINE.trim().length === 0) fail("line must not be only whitespace");
if (LINE.includes("\n") || LINE.includes("\r")) fail("line must be a single line");
if (/[\u0000-\u001f\u007f]/.test(LINE)) fail("line must not contain control characters");

// The freeze is the punchline: the bravest thing the agent did all day was ask for help.
mkdirSync(outDir, { recursive: true });
// Clear the output dir's CONTENTS only — never rmSync the dir itself (it may be a mount point).
for (const f of readdirSync(outDir)) rmSync(join(outDir, f), { recursive: true, force: true });
writeFileSync(join(outDir, "entry.txt"), LINE + "\n", "utf8");
// Read back and confirm the file is byte-exact before reporting success.
if (readFileSync(join(outDir, "entry.txt"), "utf8") !== LINE + "\n") {
  fail("entry.txt read-back mismatch");
}
