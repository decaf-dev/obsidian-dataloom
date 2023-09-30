export default class CellNotFoundError extends Error {
	constructor(options: { id?: string; rowId?: string; columnId?: string }) {
		const { id, rowId, columnId } = options || {};
		if (rowId && columnId) {
			super(`Cell at row: ${rowId}, column: ${columnId} was not found`);
			return;
		} else if (rowId) {
			super(`Cell at row: ${rowId} was not found`);
		}
		super(`Cell ${id} was not found`);
		this.name = "CellNotFoundError";
	}
}
