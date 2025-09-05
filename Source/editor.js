import { stdin, stdout } from "node:process";

export const Editor = {
	LineBuffer: [],	

	handlers: {
	
		keypress(_, event) {
			if (event.sequence == "\x1b" || event.sequence == "\x03") process.exit();
			console.log();
		}

	},

	render() {
		let rendered = "";
		
		// TODO

		stdout.write(rendered);
	}
}