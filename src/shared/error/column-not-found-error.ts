export default class ColumnNotFoundError extends Error {
	constructor({ id, type }: { id?: string; type?: string }) {
		let message = "";
		if (id) {
			message = `Cannot find column with id: ${id}`;
		} else {
			message = `Cannot find column of type: ${type}`;
		}
		super(message);
		this.name = "ColumnNotFoundError";
	}
}
