import { Environment } from "./environment.js";
import { Cursor } from "./cursor.js";

export const Editor = {
	LineBuffer: [],	
}

Editor.init =()=> {
	Editor.LineBuffer[0] = [];
}

Editor.quit =()=> {
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

Editor.render =()=> {
	let rendered = "\x1b[3J\x1b[2J\x1b[H";
	
	for (let i = 0; i < Editor.LineBuffer.length; i++) {
		rendered += (i + 1).toString() + "  ";
		rendered += Editor.LineBuffer[i].join("");
		rendered += "\n";
	}

	rendered += `\x1b[${ Cursor.y + 1 };${ Math.min( Cursor.x + 4, Editor.LineBuffer[Cursor.y].length + 4) }H`;

	process.stdout.write(rendered);
}