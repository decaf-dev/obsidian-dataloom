export default class SourceNotFoundError extends Error {
	constructor(id: string) {
		super(`Source ${id} was not found`);
		this.name = "SourceNotFoundError";
	}
}
