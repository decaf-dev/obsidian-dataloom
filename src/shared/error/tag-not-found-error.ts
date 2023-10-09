export default class TagNotFoundError extends Error {
	constructor(id: string) {
		super(`Cannot find tag with id: ${id}`);
		this.name = "TagNotFoundError";
	}
}
