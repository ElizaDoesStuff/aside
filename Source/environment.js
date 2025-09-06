export let Environment = {	
	query() {
		this.columns = process.stdout.columns;
		this.rows = process.stdout.rows;
	}
}