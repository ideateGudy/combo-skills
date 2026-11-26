#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { ROOT, AGENT_DIR, PLATFORMS, loadSkills } from "./lib.mjs";

const USAGE = `skillstack installer

  node scripts/install.mjs --list [--platform web|mobile|desktop]
  node scripts/install.mjs --platform <p> --baseline [--target <dir>] [--force]
  node scripts/install.mjs --platform <p> --skills a,b --section "<name>" [--target <dir>] [--allow-cross web]
  node scripts/install.mjs --remove a,b [--target <dir>]
  Flags: --dry-run  --force (overwrite AGENTS.md/SKILLS.md/rules; never overwrites DESIGN.md)`;

const die = (m) => { console.error("error: " + m); process.exit(1); };
const argv = process.argv.slice(2);
const o = { skills: [], remove: [], allowCross: [] };
const csv = (s) => (s || "").split(",").map((x) => x.trim()).filter(Boolean);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const next = () => (i + 1 < argv.length ? argv[++i] : die(`missing value for ${a}`));
  if (a === "--platform") o.platform = next();
  else if (a === "--target") o.target = path.resolve(next());
  else if (a === "--skills") o.skills = csv(next());
  else if (a === "--section") o.section = next();
  else if (a === "--allow-cross") o.allowCross = csv(next());
  else if (a === "--remove") o.remove = csv(next());
  else if (a === "--baseline") o.baseline = true;
  else if (a === "--force") o.force = true;
  else if (a === "--dry-run") o.dry = true;
  else if (a === "--list") o.list = true;
  else if (a === "--help" || a === "-h") { console.log(USAGE); process.exit(0); }
  else die(`unknown argument ${a}\n\n${USAGE}`);
}

const all = loadSkills();
const byName = new Map(all.map((s) => [s.name, s]));
const target = o.target || process.cwd();
const agentDir = path.join(target, AGENT_DIR);
const log = (m) => console.log((o.dry ? "[dry-run] " : "") + m);

function mkdir(p) { if (!o.dry) fs.mkdirSync(p, { recursive: true }); }
function copyFile(src, dst, { overwrite }) {
  if (fs.existsSync(dst) && !overwrite) { log(`skip (exists)  ${path.relative(target, dst)}`); return; }
  mkdir(path.dirname(dst));
  if (!o.dry) fs.copyFileSync(src, dst);
  log(`write          ${path.relative(target, dst)}`);
}

// ---------- list ----------
if (o.list) {
  for (const p of [...PLATFORMS, "shared"]) {
    if (o.platform && o.platform !== p && p !== "shared") continue;
    const items = all.filter((s) => s.dirPlatform === p);
    if (!items.length) continue;
    console.log(`\n[${p}]`);
    for (const s of items) console.log(`  ${s.name.padEnd(34)} ${s.meta.description || ""}`);
  }
  process.exit(0);
}

const activeFile = path.join(agentDir, "ACTIVE_SKILLS.md");

// ---------- remove ----------
if (o.remove.length) {
  for (const n of o.remove) {
    const dir = path.join(agentDir, "skills", n);
    if (fs.existsSync(dir)) { if (!o.dry) fs.rmSync(dir, { recursive: true, force: true }); log(`removed        ${AGENT_DIR}/skills/${n}`); }
    else log(`not installed  ${n}`);
  }
  if (fs.existsSync(activeFile) && !o.dry) {
    const keep = fs.readFileSync(activeFile, "utf8").split("\n")
      .filter((l) => !o.remove.some((n) => l.startsWith(`| ${n} |`)));
    fs.writeFileSync(activeFile, keep.join("\n"));
  }
  process.exit(0);
}

if (!o.baseline && !o.skills.length) die("nothing to do.\n\n" + USAGE);
if (!o.platform || !PLATFORMS.includes(o.platform)) die(`--platform must be one of: ${PLATFORMS.join(", ")}`);

// ---------- baseline ----------
if (o.baseline) {
  copyFile(path.join(ROOT, "AGENTS.md"), path.join(target, "AGENTS.md"), { overwrite: !!o.force });
  copyFile(path.join(ROOT, "GEMINI.md"), path.join(target, "GEMINI.md"), { overwrite: !!o.force });
  copyFile(path.join(ROOT, "DESIGN.md"), path.join(target, "DESIGN.md"), { overwrite: false });
  copyFile(path.join(ROOT, "SKILLS.md"), path.join(target, "SKILLS.md"), { overwrite: !!o.force });
  for (const f of fs.readdirSync(path.join(ROOT, "rules"))) {
    copyFile(path.join(ROOT, "rules", f), path.join(agentDir, "rules", f), { overwrite: true });
  }
  copyFile(path.join(ROOT, "platforms", `${o.platform}.md`), path.join(agentDir, "rules", `platform-${o.platform}.md`), { overwrite: true });

  const gi = path.join(target, ".gitignore");
  const line = `${AGENT_DIR}/.skills-source/`;
  const cur = fs.existsSync(gi) ? fs.readFileSync(gi, "utf8") : "";
  if (!cur.includes(line) && !o.dry) fs.writeFileSync(gi, cur + (cur.endsWith("\n") || !cur ? "" : "\n") + line + "\n");
  log(`ensure         .gitignore contains ${line}`);
  if (!fs.existsSync(activeFile) && !o.dry) {
    mkdir(agentDir);
    fs.writeFileSync(activeFile, `# ACTIVE_SKILLS\n\nPlatform: ${o.platform}\n\n## Plan (section -> skills -> reason)\n\n## Installed\n| Skill | Section | Installed |\n|---|---|---|\n`);
  }
}

// ---------- skills ----------
function resolve(names) {
  const seen = new Set();
  const order = [];
  const visit = (n, from) => {
    if (seen.has(n)) return;
    const s = byName.get(n);
    if (!s) die(`unknown skill "${n}"${from ? ` (required by ${from})` : ""}. Run with --list.`);
    const ok = s.dirPlatform === "shared" || s.dirPlatform === o.platform || o.allowCross.includes(s.dirPlatform);
    if (!ok) die(`platform firewall: "${n}" is a ${s.dirPlatform} skill but the project is ${o.platform}. ` +
      `If this is intentional, rerun with --allow-cross ${s.dirPlatform}.`);
    seen.add(n);
    s.requires.forEach((r) => visit(r, n));
    order.push(s);
  };
  names.forEach((n) => visit(n));
  return order;
}

if (o.skills.length) {
  const list = resolve(o.skills);
  const date = new Date().toISOString().slice(0, 10);
  const rows = [];
  for (const s of list) {
    const dst = path.join(agentDir, "skills", s.name);
    if (!o.dry) fs.cpSync(s.dir, dst, { recursive: true, force: true });
    log(`install skill  ${AGENT_DIR}/skills/${s.name}`);
    rows.push(`| ${s.name} | ${o.section || "-"} | ${date} |`);
  }
  if (!o.dry) {
    mkdir(agentDir);
    let text = fs.existsSync(activeFile)
      ? fs.readFileSync(activeFile, "utf8")
      : `# ACTIVE_SKILLS\n\nPlatform: ${o.platform}\n\n## Installed\n| Skill | Section | Installed |\n|---|---|---|\n`;
    const names = list.map((s) => s.name);
    const lines = text.split("\n").filter((l) => !names.some((n) => l.startsWith(`| ${n} |`)));
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    fs.writeFileSync(activeFile, lines.concat(rows).join("\n") + "\n");
  }
  console.log(`\nInstalled ${list.length} skill(s). Read ONLY: ${list.map((s) => `${AGENT_DIR}/skills/${s.name}/SKILL.md`).join(", ")}`);
}
