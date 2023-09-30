export default class ColumnNotFoundError extends Error {
	constructor({ id, type }: { id?: string; type?: string }) {
		if (id) {
			super(`Cannot find column with id: ${id}`);
		} else {
			super(`Cannot find column of type: ${type}`);
		}
		this.name = "ColumnNotFoundError";
	}
}
