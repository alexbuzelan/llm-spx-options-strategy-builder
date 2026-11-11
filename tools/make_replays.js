#!/usr/bin/env node
/* Bundles replays/replay_*.json (saved with the page's Save conversation button, page opened with ?record)
   into replays/replays.js, which the page loads. A page opened from disk cannot read other files itself.

   Usage, from the repo folder:  node tools/make_replays.js */
"use strict";
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "replays");
const files = fs.readdirSync(dir).filter((f) => /^replay_.*\.json$/i.test(f)).sort();
const list = [];
for (const f of files) {
  const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8").replace(/^﻿/, ""));
  if (r.format !== "chat-replay-1" || !Array.isArray(r.turns) || !r.turns.length) {
    console.log("Skipped " + f + ": not a replay file");
    continue;
  }
  list.push(r);
}
const js = "/* Recorded assistant conversations, played back when a visitor has no API key.\n" +
  "   Written by tools/make_replays.js from the replay_*.json files in this folder. Do not edit by hand. */\n" +
  "window.CHAT_REPLAYS = " + JSON.stringify(list, null, 1) + ";\n";
fs.writeFileSync(path.join(dir, "replays.js"), js, "utf8");
console.log("Wrote replays/replays.js with " + list.length + " conversation" + (list.length === 1 ? "" : "s") + ".");
