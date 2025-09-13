import { Editor } from "./editor.js";

export let Cursor = {
	x: 0,
	y: 0,
	scrollx: 0,
	scrolly: 0,
	selectx: 0,
	selecty: 0,
	realx: 1,
	realy: 1
};

Cursor.clamp =()=> { Cursor.x = Math.min( Cursor.x, Editor.LineBuffer[Cursor.y].length); }
Cursor.deselect =()=> { Cursor.selectx = Cursor.x; Cursor.selecty = Cursor.y; }

Cursor.left =shift=> {
	Cursor.clamp();

	if (Cursor.x == 0 && Cursor.y == 0) return;
	if (Cursor.x == 0) {
		Cursor.y -= 1;
		Cursor.x = Editor.LineBuffer[Cursor.y].length;
		return;
	}
	Cursor.x -= 1;
	Cursor.deselect();
}

Cursor.right =shift=> {
	if (shift) {
		return;
	}
	if (Cursor.x == Editor.LineBuffer[Cursor.y].length && Cursor.y == Editor.LineBuffer.length - 1) return;
	if (Cursor.x == Editor.LineBuffer[Cursor.y].length) {
		Cursor.y += 1;
		Cursor.x = 0;
		return;
	}
	Cursor.x += 1;
	Cursor.deselect();
}

Cursor.up =shift=> {
	if (Cursor.y == 0) {
		Cursor.x = 0;
		return;
	}
	Cursor.y -= 1;
}

Cursor.down =shift=> {
	if (Cursor.y == Editor.LineBuffer.length - 1) {
		Cursor.x = Editor.LineBuffer[Cursor.y].length;
		return;
	}
	Cursor.y += 1;
}
