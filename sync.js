// Usage: node sync.js
// Copies conspiracy.json into the CLAIMS block of index.html, so index.html stays a single shareable file.
// Validates every entry first, and exits without touching index.html if anything is wrong.
const fs = require("fs");

const json = JSON.parse(fs.readFileSync("conspiracy.json", "utf8"));
const errors = [];
const seen = new Set();
json.forEach((c, i) => {
  const at = `entry ${i + 1}`;
  if (typeof c.real !== "boolean") errors.push(`${at}: "real" must be true or false`);
  if (typeof c.text !== "string" || !c.text.trim()) errors.push(`${at}: missing "text"`);
  if (typeof c.explain !== "string" || !c.explain.trim()) errors.push(`${at}: missing "explain"`);
  if (/<\/script/i.test(JSON.stringify(c))) errors.push(`${at}: contains "</script"`);
  if (c.wiki !== undefined && !/^https:\/\/en\.wikipedia\.org\/wiki\/[^\s"'<>]+$/.test(c.wiki)) errors.push(`${at}: "wiki" must be an https://en.wikipedia.org/wiki/... link`);
  if (c.wiki && c.real === false) errors.push(`${at}: made-up claims shouldn't have a "wiki" link`);
  if (seen.has(c.text)) errors.push(`${at}: duplicate text`);
  seen.add(c.text);
});
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const html = fs.readFileSync("index.html", "utf8");
const block = /(\/\/ <claims>\r?\n)[\s\S]*?(\/\/ <\/claims>)/;
if (!block.test(html)) throw new Error("index.html has no // <claims> ... // </claims> markers");
const body = json.map((c) => "  " + JSON.stringify({ real: c.real, text: c.text, explain: c.explain, ...(c.wiki && { wiki: c.wiki }) })).join(",\n");
fs.writeFileSync("index.html", html.replace(block, (_, a, b) => `${a}const CLAIMS = [\n${body},\n];\n${b}`));

const real = json.filter((c) => c.real).length;
console.log(`Synced ${json.length} claims (${real} real, ${json.length - real} made up).`);
const unlinked = json.filter((c) => c.real && !c.wiki);
if (unlinked.length) console.log(`${unlinked.length} real claims have no wiki link:\n` + unlinked.map((c) => "  - " + c.text.slice(0, 70)).join("\n"));
