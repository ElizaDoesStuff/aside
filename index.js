import { default as keypress } from "keypress";
import { stdin, stdout } from "node:process";

import { Editor } from "./Source/editor.js";
import { Environment } from "./Source/environment.js"
import { Cursor } from "./Source/cursor.js";

if (!stdin.isTTY) { stdout.write("Standard input stream is not a TTY."); process.exit(); }

await Environment.query();
Editor.init();

keypress(stdin);
stdin.on("keypress", Editor.keypress);

stdin.setRawMode(true);
stdin.resume();

setInterval(Editor.render, 1)