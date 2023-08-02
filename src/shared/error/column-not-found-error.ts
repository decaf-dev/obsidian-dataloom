export default class ColumNotFoundError extends Error {
	constructor(id?: string) {
		super(`Column ${id} was not found`);
		this.name = "ColumNotFoundError";
	}
}
