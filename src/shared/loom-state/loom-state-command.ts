import { CommandRedoError, CommandUndoError } from "./commands/command-errors";
import { LoomState } from "./types";

abstract class LoomStateCommand {
	shouldSortRows: boolean;
	hasExecuteBeenCalled: boolean;
	hasUndoBeenCalled: boolean;

	constructor(shouldSortRows = false) {
		this.hasExecuteBeenCalled = false;
		this.hasUndoBeenCalled = false;
		this.shouldSortRows = shouldSortRows;
	}

	onExecute() {
		this.hasExecuteBeenCalled = true;
	}

	onRedo() {
		if (!this.hasUndoBeenCalled) throw new CommandRedoError();
		this.hasUndoBeenCalled = false;
	}

	onUndo() {
		if (!this.hasExecuteBeenCalled) throw new CommandUndoError();
		this.hasUndoBeenCalled = true;
	}

	abstract execute(prevState: LoomState): LoomState;
	abstract redo(prevState: LoomState): LoomState;
	abstract undo(prevState: LoomState): LoomState;
}

export default LoomStateCommand;
