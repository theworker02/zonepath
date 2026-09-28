
function readInput(fallback) {
  if (fallback != null && String(fallback).length) return String(fallback);
  if (process.stdin && process.stdin.isTTY) return "";
  try {
    const fs = require("fs");
    if (typeof fs.readFileSync === "function") {
      // Non-blocking when no piped data: use readFileSync only if fd 0 has size or isn't a TTY.
      return fs.readFileSync(0, "utf8");
    }
  } catch (_) {}
  return "";
}

function parseCsv(text, sep = ",") {
  return String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")
    .filter(l => l.length).map(line => {
      const cells = []; let cur = ""; let q = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') { q = !q; continue; }
        if (c === sep && !q) { cells.push(cur); cur = ""; continue; }
        cur += c;
      }
      cells.push(cur); return cells;
    });
}
function run(argv) {
  const sep = argv[0] === "--tsv" ? "\t" : ",";
  const sample = argv[0] === "--tsv" ? argv.slice(1).join(" ") : argv.join(" ");
  const text = sample || "a,b,c\n1,2,3\n4,5,6";
  const rows = parseCsv(text, sep);
  return JSON.stringify({ rows: rows.length, cols: rows[0]?.length || 0, sample: rows.slice(0, 5) }, null, 2);
}

module.exports = { readInput, parseCsv, run };
