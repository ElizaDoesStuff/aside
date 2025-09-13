import stringWidth from "string-width";
import { all, common, createEmphasize } from "emphasize";

const emphasize = createEmphasize();

import { Environment } from "./environment.js";
import { Cursor } from "./cursor.js";
import { Lines, ANSI, Size } from "./constants.js"

export const Editor = {
	width: 0,
	height: 0,
	
	LineBuffer: [],
	FilePath: ""
}

Editor.init =()=> {
	Editor.LineBuffer[0] = [];
	Editor.width = Environment.columns - 4;
	Editor.height = Environment.rows - 4;
}

Editor.quit =()=> {
	process.stdout.write("\x1b[3J\x1b[2J\x1b[H");
	console.log(Editor.LineBuffer);
	process.exit();
}

Editor.keypress =(character, event)=> {
	if (event == undefined) {
		Editor.type(character);
	} else {
		if (event.name == "q" && event.ctrl) { Editor.quit(); return; }
		if (event.name == "backspace") { Editor.backspace(); return; }
		if (event.name == "return") { Editor.newline(); return; }
		if (event.name == "left") { Cursor.left(event.shift); return; }
		if (event.name == "right") { Cursor.right(event.shift); return; }
		if (event.name == "up") { Cursor.up(event.shift); return; }
		if (event.name == "down") { Cursor.down(event.shift); return; }
		if (event.name == "tab") { Editor.type("\t"); return; }
		if (!character || event.ctrl || event.meta) return;
		Editor.type(character);	
	}
}

Editor.type =character=> {
	Editor.LineBuffer[Cursor.y].splice(Cursor.x, 0, character);
	Cursor.x += 1;
}

Editor.backspace =()=> {
	Cursor.clamp();
	
	if (Cursor.x == 0 && Cursor.y == 0) return;
	if (Cursor.x == 0) {
		let restOfLine = Editor.LineBuffer.splice(Cursor.y, 1)[0];
		Cursor.y -= 1;
		Cursor.x = Editor.LineBuffer[Cursor.y].length;
		Editor.LineBuffer[Cursor.y].splice(Cursor.x + 1, 0, ...restOfLine);
		return;
	}
	Cursor.x -= 1;
	Editor.LineBuffer[Cursor.y].splice(Cursor.x, 1);
}

Editor.newline =()=> {
	let restOfLine = Editor.LineBuffer[Cursor.y].splice(Cursor.x, Infinity);
	Editor.LineBuffer.splice(Cursor.y + 1, 0, restOfLine);
	Cursor.right();
}

Editor.save =()=> {
	
}

Editor.render =()=> {
	Environment.query();

	let MainBuffer = "";
	Cursor.realx = 3 + Size.LINENUMBER;
	Cursor.realy = Cursor.y - Cursor.scrolly + 2;

	// Clear Screen //
	MainBuffer += ANSI.CLEAR;

	// Draw top row //
	MainBuffer += Lines.TOPLEFT + Lines.HORIZONTAL;
	for (let i = 0; i < Editor.width; i++) MainBuffer += Lines.HORIZONTAL;
	MainBuffer += Lines.HORIZONTAL + Lines.TOPRIGHT;
	MainBuffer += "\n"

	// Draw editor rows //
	for (let i = 0; i < Editor.height; i++) {

		let Line =  Lines.VERTICAL + Lines.BLANK;
		let code = "";
		
		if (i >= Editor.LineBuffer.length) {
			for (let i = 0; i < Editor.width; i++) Line += Lines.BLANK;
			Line += Lines.BLANK + Lines.VERTICAL;

			MainBuffer += Line;
			MainBuffer += "\n";
			continue;
		}

		Line += (i + 1).toString();
		while (stringWidth(Line) - 2 < Size.LINENUMBER) Line += Lines.BLANK;

		let j = 0;
		while (stringWidth(code) + Size.LINENUMBER < Editor.width) {
			code += Editor.LineBuffer[i][j] ? Editor.LineBuffer[i][j] : " ";
			if (i == Cursor.y && j < Cursor.x) Cursor.realx += Editor.LineBuffer[i][j] ? stringWidth(Editor.LineBuffer[i][j]) : 0;
			j++;
		}
		
		Line += code;
		Line += Lines.BLANK + Lines.VERTICAL;

		MainBuffer += Line;
		MainBuffer += "\n";
	}
	
	// Draw divider line //
	MainBuffer += Lines.TLEFT + Lines.HORIZONTAL;
	for (let i = 0; i < Editor.width; i++) MainBuffer += Lines.HORIZONTAL;
	MainBuffer += Lines.HORIZONTAL + Lines.TRIGHT;
	MainBuffer += "\n"

	// Draw bottom bar content //
	MainBuffer += Lines.VERTICAL + Lines.BLANK;
	for (let i = 0; i < Editor.width; i++) MainBuffer += Lines.BLANK;
	MainBuffer += Lines.BLANK + Lines.VERTICAL;
	MainBuffer += "\n";

	// Draw bottom row
	MainBuffer += Lines.BOTTOMLEFT + Lines.HORIZONTAL;
	for (let i = 0; i < Editor.width; i++) MainBuffer += Lines.HORIZONTAL;
	MainBuffer += Lines.HORIZONTAL + Lines.BOTTOMRIGHT;

	// Move cursor //
	MainBuffer += ANSI.CURSORTO(Cursor.realx, Cursor.realy);

	process.stdout.write(MainBuffer);
}