export default class CommandPatchError extends Error {
	constructor() {
		super("patch must be set before undo() or redo() are available");
		this.name = "CommandPatchError";
	}
}
