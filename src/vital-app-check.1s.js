#!/usr/bin/env /opt/homebrew/bin/node

// <xbar.title>Vital App Checker</xbar.title>;
// <xbar.author>Tahsin</xbar.author>
// <xbar.author.github>tahsinature</xbar.author.github>
// <xbar.desc>Checks if all the required apps running.</xbar.desc>
// <xbar.dependencies>node</xbar.dependencies>

const { execSync } = require("child_process");

module.exports.getRunningApps = () => {
  return execSync(`ps -c -o comm -p $(pgrep -u $USER -d, -f /Applications) | grep -Ev 'Helper|handler'`).toString().split("\n").filter(Boolean);
};

module.exports.lights = {
  green: "🟢",
  grey: "⚪",
  red: "🔴",
};

module.exports.required = [
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

module.exports.exec = () => {
  const result = this.getRunningApps();

  const missing = this.required.map((r) => (result.find((a) => a.toLowerCase().includes(r.toLowerCase())) ? null : r)).filter(Boolean);

  // if (!missing.length) return console.log("●");
  const circleVariations = ["🟢", "⚪", "🔴"];
  if (!missing.length) return console.log(this.lights.grey);

  console.log(`${missing.length} ${this.lights.red}`);
  console.log("---");
  for (const m of missing) {
    console.log(m);
  }
};

if (require.main === module) this.exec();
