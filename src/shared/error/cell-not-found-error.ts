export default class CellNotFoundError extends Error {
	constructor(options: { id?: string; rowId?: string; columnId?: string }) {
		const { id, rowId, columnId } = options || {};
		if (rowId || columnId) super(`Cell ${rowId}:${columnId} was not found`);
		super(`Cell ${id} was not found`);
		this.name = "CellNotFoundError";
	}
}
