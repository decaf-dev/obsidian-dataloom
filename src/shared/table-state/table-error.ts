export class ColumnIdError extends Error {
	constructor(id: string) {
		super(`Reference column ${id} is undefined`);
		this.name = "ColumnIdError";
	}
}
export class TagIdError extends Error {
	constructor(id: string) {
		super(`Reference tag ${id} is undefined`);
		this.name = "TagIdError";
	}
}

export class RowIdError extends Error {
	constructor(id: string) {
		super(`Reference row ${id} is undefined`);
		this.name = "RowIdError";
	}
}

export class CellIdError extends Error {
	constructor(id: string) {
		super(`Reference cell ${id} is undefined`);
		this.name = "CellIdError";
	}
}
export class CellNotFoundError extends Error {
	constructor() {
		super("Cell not found");
		this.name = "CellNotFoundError";
	}
}
