import { default as keypress } from "keypress";
import { stdin, stdout } from "node:process";

import { Editor } from "./Source/editor.js";
import { Environment } from "./Source/environment.js"

if (!stdin.isTTY) { stdout.write("Standard input stream is not a TTY."); process.exit(); }

let Cursor = {x: 0, y: 0};

Environment.query();

keypress(stdin);
stdin.on("keypress", Editor.handlers.keypress);

setInterval(Editor.render, 0);

stdin.setRawMode(true);
stdin.resume();