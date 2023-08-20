export default class TagNotFoundError extends Error {
	constructor(id: string) {
		super(`Tag ${id} was not found`);
		this.name = "TagNotFoundError";
	}
}
