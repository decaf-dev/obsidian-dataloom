export class CommandUndoError extends Error {
	constructor() {
		super(`execute() must be called before undo() is available`);
		this.name = "UndoError";
	}
}

export class DeleteCommandArgumentsError extends Error {
	constructor() {
		super(`Either 'id' or 'last' must be defined`);
		this.name = "DeleteCommandArgumentsError";
	}
}
