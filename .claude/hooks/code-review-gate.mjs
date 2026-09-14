/**
 * Runs the `code-reviewer` subagent at the end of every turn that changed code.
 *
 *   node code-review-gate.mjs mark   PostToolUse (Edit|Write|MultiEdit|NotebookEdit):
 *                                    records each changed code file for this session.
 *   node code-review-gate.mjs gate   Stop: if code changed this turn, blocks the stop once
 *                                    and tells Claude to run the reviewer.
 *
 * Reviewing per turn rather than per edit means the reviewer sees finished work,
 * not half-applied changes, and runs once instead of on every keystroke-sized edit.
 * `stop_hook_active` is true when Claude is already continuing because of this hook,
 * so fixes made in response to a review do not trigger another review (no loops).
 */
import { appendFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CODE_FILE = /\.(ts|tsx|js|jsx|mjs|cjs|css)$/i;
const IGNORED_DIR = /(^|[\\/])(node_modules|\.next|\.claude|coverage)([\\/]|$)/;

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const marker = path.join(tmpdir(), `claude-code-review-${input.session_id ?? "default"}.txt`);

function mark() {
  const file =
    input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? input.tool_response?.filePath;
  if (!file || !CODE_FILE.test(file)) return;

  const relative = path.relative(projectDir, path.resolve(projectDir, file));
  if (relative.startsWith("..") || path.isAbsolute(relative) || IGNORED_DIR.test(relative)) return;

  appendFileSync(marker, `${relative}\n`);
}

function gate() {
  if (!existsSync(marker)) return;

  const files = [...new Set(readFileSync(marker, "utf8").split("\n").filter(Boolean))];
  rmSync(marker, { force: true });
  if (input.stop_hook_active || files.length === 0) return;

  const reason = [
    "Code files were changed this turn:",
    ...files.map((f) => `  - ${f}`),
    "",
    'Before finishing, launch the `code-reviewer` subagent (Agent tool, subagent_type "code-reviewer") to review these changes.',
    "Then: fix any Critical or High findings that are in the code you just changed, and give the user a short review summary",
    "(verdict, what you fixed, what remains open). Do not launch the reviewer again after applying fixes.",
  ].join("\n");

  process.stdout.write(JSON.stringify({ decision: "block", reason }));
}

if (process.argv[2] === "mark") mark();
else if (process.argv[2] === "gate") gate();
