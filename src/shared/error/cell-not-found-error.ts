export default class CellNotFoundError extends Error {
	constructor(options: { id?: string; rowId?: string; columnId?: string }) {
		const { id, rowId, columnId } = options || {};
		if (rowId && columnId) {
			super(`Cell with row: ${rowId}, column: ${columnId} was not found`);
			return;
		} else if (rowId) {
			super(`Cell with row: ${rowId} was not found`);
		} else if (columnId) {
			super(`Cell with column: ${columnId} was not found`);
		}
		super(`Cell ${id} was not found`);
		this.name = "CellNotFoundError";
	}
}
