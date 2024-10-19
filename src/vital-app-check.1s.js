#!/usr/bin/env /opt/homebrew/bin/node

const { execSync } = require("child_process");

const result = execSync(`ps -c -o comm -p $(pgrep -u $USER -d, -f /Applications) | grep -Ev 'Helper|handler'`).toString().split("\n");
const required = [
  "Box UI", // Cloud storage
  "Dropover", // Dropzone
  "Google Drive", // Cloud storage
  "Ice", // Menubar organizer
  "Itsycal", // Calendar
  "KeepingYouAwake", // Caffeine
  "Monosnap", // Screenshot
  "Raycast", // App
  "Rectangle", // Window manager
  "ScreenBrush", // Annotation tool
  "Shottr", // Screenshot
  "Soduto", // Android Companion
  "Unclutter", // Dropzone
];

const missing = required.map((r) => (result.find((a) => a.toLowerCase().includes(r.toLowerCase())) ? null : r)).filter(Boolean);

// if (!missing.length) return console.log("●");
const circleVariations = ["🟢", "⚪", "🔴"];
if (!missing.length) return console.log(circleVariations[1]);

console.log(`${missing.length} ${circleVariations[2]}`);
console.log("---");
for (const m of missing) {
  console.log(m);
}
