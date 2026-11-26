#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { ROOT, SKILL_DIRS, loadSkills } from "./lib.mjs";

const skills = loadSkills();
const names = new Set(skills.map((s) => s.name));
const skillsMd = fs.readFileSync(path.join(ROOT, "SKILLS.md"), "utf8");
const errors = [];
const warns = [];

for (const s of skills) {
  const where = `skills/${s.dirPlatform}/${s.name}`;
  if (!SKILL_DIRS.includes(s.dirPlatform)) errors.push(`${where}: unknown platform folder`);
  if (s.meta.name !== s.name) errors.push(`${where}: frontmatter name "${s.meta.name}" must equal folder name`);
  if (s.meta.platform !== s.dirPlatform) errors.push(`${where}: frontmatter platform "${s.meta.platform}" must equal folder "${s.dirPlatform}"`);
  if (s.name !== "combo-skills" && !s.name.startsWith(s.dirPlatform + "-")) errors.push(`${where}: name must start with "${s.dirPlatform}-"`);
  if (!s.meta.description) errors.push(`${where}: missing description`);
  else if (s.meta.description.length > 400) warns.push(`${where}: description is ${s.meta.description.length} chars (keep < 300)`);
  if (!s.sections.length) warns.push(`${where}: no sections declared`);
  for (const r of s.requires) if (!names.has(r)) errors.push(`${where}: requires unknown skill "${r}"`);
  if (!new RegExp(`\\b${s.name}\\b`).test(skillsMd)) errors.push(`${where}: not listed in SKILLS.md registry`);
  const lines = fs.readFileSync(s.file, "utf8").split("\n").length;
  if (lines > 400) warns.push(`${where}: SKILL.md has ${lines} lines (limit 400; move detail to templates/ or scripts/)`);
  if (!/checklist/i.test(fs.readFileSync(s.file, "utf8"))) warns.push(`${where}: no Checklist section`);
}

const registry = {
  skills: skills
    .map((s) => ({
      name: s.name,
      platform: s.dirPlatform,
      description: s.meta.description,
      sections: s.sections,
      tags: s.tags,
      requires: s.requires,
      path: `skills/${s.dirPlatform}/${s.name}`,
    }))
    .sort((a, b) => a.platform.localeCompare(b.platform) || a.name.localeCompare(b.name)),
};
fs.writeFileSync(path.join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");

warns.forEach((w) => console.warn("warn:  " + w));
errors.forEach((e) => console.error("error: " + e));
console.log(`${skills.length} skills checked, ${errors.length} error(s), ${warns.length} warning(s). registry.json updated.`);
process.exit(errors.length ? 1 : 0);
