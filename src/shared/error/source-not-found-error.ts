export default class SourceNotFoundError extends Error {
	constructor(id: string) {
		super(`Cannot find source with id: ${id}`);
		this.name = "SourceNotFoundError";
	}
}
