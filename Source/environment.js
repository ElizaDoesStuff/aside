export let Environment = {
	frame: 0,

	query() {
		this.columns = process.stdout.columns;
		this.rows = process.stdout.rows;
	}
}