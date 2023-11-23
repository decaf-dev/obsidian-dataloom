export default class CommandUndoError extends Error {
	constructor() {
		super(`execute() must be called before undo() is available`);
		this.name = "CommandUndoError";
	}
}
