export default class CellNotFoundError extends Error {
	constructor(options: { id?: string; rowId?: string; columnId?: string }) {
		const { id, rowId, columnId } = options || {};
		let message = "";
		if (rowId && columnId) {
			message = `Cannot find cell with row id: ${rowId} and column id: ${columnId}`;
		} else if (rowId) {
			message = `Cannot find cell with row id: ${rowId}`;
		} else if (columnId) {
			message = `Cannot find cell with column id: ${columnId}`;
		} else {
			message = `Cannot find cell with id: ${id}`;
		}
		super(message);
		this.name = "CellNotFoundError";
	}
}
