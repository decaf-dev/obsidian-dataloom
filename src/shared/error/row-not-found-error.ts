export default class RowNotFoundError extends Error {
	constructor(id?: string) {
		super(`Row ${id} was not found`);
		this.name = "RowNotFoundError";
	}
}
