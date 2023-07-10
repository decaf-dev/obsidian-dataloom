export class ColumNotFoundError extends Error {
	constructor(id?: string) {
		super(`Column ${id} was not found`);
		this.name = "ColumNotFoundError";
	}
}
export class TagNotFoundError extends Error {
	constructor(id: string) {
		super(`Tag ${id} was not found`);
		this.name = "TagNotFoundError";
	}
}

export class RowNotFoundError extends Error {
	constructor(id?: string) {
		super(`Row ${id} was not found`);
		this.name = "RowNotFoundError";
	}
}

export class CellNotFoundError extends Error {
	constructor(options: { id?: string; rowId?: string; columnId?: string }) {
		const { id, rowId, columnId } = options || {};
		if (rowId || columnId) super(`Cell ${rowId}:${columnId} was not found`);
		super(`Cell ${id} was not found`);
		this.name = "CellNotFoundError";
	}
}
