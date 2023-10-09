export default class RowNotFoundError extends Error {
	constructor(id?: string) {
		super(`Cannot find row with id: ${id}`);
		this.name = "RowNotFoundError";
	}
}
