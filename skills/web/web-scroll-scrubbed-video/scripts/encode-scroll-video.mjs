#!/usr/bin/env node
// All-intra encoder for scroll-scrubbed video. Cross-platform (Node + FFmpeg on PATH).
// Usage: node encode-scroll-video.mjs --in reference/hero-raw.mp4 --name hero-construction --out public/videos
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const get = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : d; };
const input = get("in");
const name = get("name");
const outDir = get("out", "public/videos");
if (!input || !name) {
  console.error("usage: encode-scroll-video.mjs --in <raw.mp4> --name <basename> [--out public/videos] [--width 1600] [--fps 24] [--crf 23] [--mobile-width 720] [--mobile-crf 26]");
  process.exit(1);
}
if (!fs.existsSync(input)) { console.error(`input not found: ${input}`); process.exit(1); }
for (const bin of ["ffmpeg", "ffprobe"]) {
  if (spawnSync(bin, ["-version"]).status !== 0) { console.error(`${bin} not found on PATH. Install FFmpeg first.`); process.exit(1); }
}
fs.mkdirSync(outDir, { recursive: true });

const fps = get("fps", "24");
const profiles = [
  { label: "desktop", file: `${name}.mp4`, width: get("width", "1600"), crf: get("crf", "23"), budgetMB: 15 },
  { label: "mobile", file: `${name}-mobile.mp4`, width: get("mobile-width", "720"), crf: get("mobile-crf", "26"), budgetMB: 6 },
];

let failed = false;
for (const p of profiles) {
  const out = path.join(outDir, p.file);
  console.log(`\n== encoding ${p.label} -> ${out}`);
  const r = spawnSync("ffmpeg", [
    "-y", "-i", input, "-an",
    "-vf", `scale='min(${p.width},iw)':-2:flags=lanczos,fps=${fps}`,
    "-c:v", "libx264", "-preset", "slow", "-crf", p.crf,
    "-g", "1", "-keyint_min", "1", "-sc_threshold", "0", "-bf", "0",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
  ], { stdio: "inherit" });
  if (r.status !== 0) { console.error("ffmpeg failed"); process.exit(1); }

  const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "frame=pict_type", "-of", "csv=p=0", out], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const types = probe.stdout.split(/\r?\n/).map((l) => l.trim().replace(/,.*/, "")).filter(Boolean);
  const bad = types.filter((t) => t !== "I").length;
  const mb = fs.statSync(out).size / 1048576;
  console.log(`   frames: ${types.length}, non-I frames: ${bad} -> ${bad === 0 ? "PASS" : "FAIL"}`);
  console.log(`   size: ${mb.toFixed(1)} MB (budget ${p.budgetMB} MB)${mb > p.budgetMB ? "  WARNING: over budget - shorten clip, lower --width/--fps or raise --crf" : ""}`);
  if (bad) failed = true;
}

const poster = path.join(outDir, `${name}-poster.jpg`);
spawnSync("ffmpeg", ["-y", "-i", path.join(outDir, profiles[0].file), "-frames:v", "1", "-q:v", "3", poster], { stdio: "ignore" });
console.log(`\nposter: ${poster}`);
process.exit(failed ? 1 : 0);
