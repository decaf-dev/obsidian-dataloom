export class CommandUndoError extends Error {
	constructor() {
		super(`execute() must be called before undo() is available`);
		this.name = "CommandUndoError";
	}
}

export class CommandRedoError extends Error {
	constructor() {
		super(`undo() must be called before redo() is available`);
		this.name = "CommandRedoError";
	}
}

export class DeleteCommandArgumentsError extends Error {
	constructor() {
		super(`Either 'id' or 'last' must be defined`);
		this.name = "DeleteCommandArgumentsError";
	}
}
