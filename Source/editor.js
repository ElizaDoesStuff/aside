import { Environment } from "./environment.js";
import { Cursor } from "./cursor.js";

export const Editor = {
	LineBuffer: [],
	FilePath: ""
}

Editor.init =()=> {
	Editor.LineBuffer[0] = [];
}

Editor.quit =()=> {
	process.stdout.write("\x1b[3J\x1b[2J\x1b[H")
	process.exit();
}

Editor.keypress =(character, event)=> {
	if (event == undefined) {
		Editor.type(character);
	} else {
		if (event.name == "q" && event.ctrl) { Editor.quit(); return; }
		if (event.name == "backspace") { Editor.backspace(); return; }
		if (event.name == "return") { Editor.newline(); return; }
		if (event.name == "left") { Cursor.left(); return; }
		if (event.name == "right") { Cursor.right(); return; }
		if (event.name == "up") { Cursor.up(); return; }
		if (event.name == "down") { Cursor.down(); return; }
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

	// Clear the whole screen and scrollback buffer and move the cursor to the start //
	let rendered = "\x1b[3J\x1b[2J\x1b[H";
	
	// Draw the top of the outline //
	let topText = "This will be a file name later.txt"
	rendered += "╭";
	for (let i = 0; i < Environment.columns - 2; i++) rendered += topText[i - 1] ? topText[i - 1] : "—";
	rendered += "╮\n";

	// Render all of the lines with content //
	for (let i = 0; i < Editor.LineBuffer.length; i++) {
		rendered += "│ ";
		
		let lineNumber = (i + 1).toString();
		// If your file has a line count in the 5 digits, you have a problem. //
		for (let j = 0; j < 4; j++) rendered += lineNumber[j] ? lineNumber[j] : " ";
		for (let j = 0; j < Environment.columns - 3 - 4; j++) rendered += Editor.LineBuffer[i][j] ? Editor.LineBuffer[i][j] : " ";

		rendered += "│\n";
	}

	// Render all the other empty lines //
	for (let i = Editor.LineBuffer.length + 1; i < Environment.rows - 3; i++) {
		rendered += "│";
		for (let j = 0; j < Environment.columns - 2; j++) rendered += " ";
		rendered += "│\n";
	}

	// Draw the bottom of the first box //
	rendered += "├";
	for (let i = 0; i < Environment.columns - 2; i++) rendered += "—";
	rendered += "┤\n";

	rendered += "│ "
	let bottomText = ">> Wow look it's some awesome place holder text!!";
	for (let i = 0; i < Environment.columns - 3; i++) rendered += bottomText[i - 1] ? bottomText[i - 1] : " ";
	rendered += "│\n"
	
	// Draw the bottom of the outline //
	rendered += "╰";
	for (let i = 0; i < Environment.columns - 2; i++) rendered += "—";
	rendered += "╯";

	// Move the cursor to the right spot //
	let realCursorY = Cursor.y - Cursor.scrolly + 2;
	let realCursorX = Cursor.x - Cursor.scrollx + 7;
	rendered += `\x1b[${realCursorY};${realCursorX}H`

	process.stdout.write(rendered);
}