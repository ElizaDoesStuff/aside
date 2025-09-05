

export let Environment = {
	size: {w: 0, h: 0},
	
	query() {
		this.size.w = process.stdout.columns;
		this.size.h = process.stdout.rows;
	}
}