import { Editor } from "./editor.js";

export let Cursor = {
	x: 0,
	y: 0,
	scrollx: 0,
	scrolly: 0
};

Cursor.left =()=> {
	Cursor.x = Math.min( Cursor.x + 4, Editor.LineBuffer[Cursor.y].length + 4);

	if (Cursor.x == 0 && Cursor.y == 0) return;
	if (Cursor.x == 0) {
		Cursor.y -= 1;
		Cursor.x = Editor.LineBuffer[Cursor.y].length;
		return;
	}
	Cursor.x -= 1;
}

Cursor.right =()=> {
	Cursor.x = Math.min( Cursor.x + 4, Editor.LineBuffer[Cursor.y].length + 4);

	if (Cursor.x == Editor.LineBuffer[Cursor.y].length && Cursor.y == Editor.LineBuffer.length - 1) return;
	if (Cursor.x == Editor.LineBuffer[Cursor.y].length) {
		Cursor.y += 1;
		Cursor.x = 0;
		return;
	}
	Cursor.x += 1;
}

Cursor.up =()=> {
	if (Cursor.y == 0) {
		Cursor.x = 0;
		return;
	}
	Cursor.y -= 1;
}

Cursor.down =()=> {
	if (Cursor.y == Editor.LineBuffer.length - 1) {
		Cursor.x = Editor.LineBuffer[Cursor.y].length;
		return;
	}
	Cursor.y += 1;
}
