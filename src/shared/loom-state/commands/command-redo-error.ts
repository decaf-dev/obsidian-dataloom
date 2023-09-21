export default class CommandRedoError extends Error {
	constructor() {
		super(`undo() must be called before redo() is available`);
		this.name = "CommandRedoError";
	}
}
