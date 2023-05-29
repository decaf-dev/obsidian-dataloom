export class ColumNotFoundError extends Error {
	constructor(id: string) {
		super(`Column ${id} is undefined`);
		this.name = "ColumNotFoundError";
	}
}
export class TagNotFoundError extends Error {
	constructor(id: string) {
		super(`Tag ${id} is undefined`);
		this.name = "TagNotFoundError";
	}
}

export class RowNotFoundError extends Error {
	constructor(id: string) {
		super(`Reference row ${id} is undefined`);
		this.name = "RowNotFoundError";
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
