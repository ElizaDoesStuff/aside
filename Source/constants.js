export const Lines = {
	TOPLEFT: "╭",
	TOPRIGHT: "╮",
	BOTTOMLEFT: "╰",
	BOTTOMRIGHT: "╯",
	VERTICAL: "│",
	HORIZONTAL: "─",
	TRIGHT: "┤",
	TLEFT: "├",
	BLANK: " ",
};

export const ANSI = {
	CLEAR: "\x1b[3J\x1b[2J\x1b[H",
	UNSTYLE: "\x1b[m",
	CURSORTO: (x,y) => `\x1b[${y};${x}H`
};