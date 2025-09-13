export let Environment = {
	frame: 0,

	query() {
		this.columns = process.stdout.columns;
		this.rows = process.stdout.rows;
	},
	
	forColumn(x) { for (let i = 0; i < this.columns; i++) x(i); }
}