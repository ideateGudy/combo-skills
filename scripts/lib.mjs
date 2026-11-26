import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Antigravity workspace folder. Change here if your IDE version uses another folder.
export const AGENT_DIR = ".agent";
export const PLATFORMS = ["web", "mobile", "desktop", "backend"];
export const SKILL_DIRS = [...PLATFORMS, "shared"];

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = {};
  if (!m) return meta;
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i < 1 || /^\s/.test(line)) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).replace(/\s+#.*$/, "").trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    }
    meta[key] = val;
  }
  return meta;
}

export function loadSkills() {
  const base = path.join(ROOT, "skills");
  const out = [];
  if (!fs.existsSync(base)) return out;
  for (const platform of fs.readdirSync(base)) {
    const pdir = path.join(base, platform);
    if (!fs.statSync(pdir).isDirectory()) continue;
    for (const name of fs.readdirSync(pdir)) {
      const dir = path.join(pdir, name);
      const file = path.join(dir, "SKILL.md");
      if (!fs.existsSync(file)) continue;
      const meta = parseFrontmatter(fs.readFileSync(file, "utf8"));
      out.push({
        name,
        dirPlatform: platform,
        dir,
        file,
        meta,
        requires: Array.isArray(meta.requires) ? meta.requires : [],
        sections: Array.isArray(meta.sections) ? meta.sections : [],
        tags: Array.isArray(meta.tags) ? meta.tags : [],
      });
    }
  }
  return out;
}
