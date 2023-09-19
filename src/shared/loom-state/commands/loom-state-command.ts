import { LoomState } from "../types/loom-state";
import CommandRedoError from "./command-redo-error";
import CommandUndoError from "./command-undo-error";

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

	onUndo() {
		if (!this.hasExecuteBeenCalled) throw new CommandUndoError();
		this.hasUndoBeenCalled = true;
	}

	onRedo() {
		if (!this.hasUndoBeenCalled) throw new CommandRedoError();
		this.hasUndoBeenCalled = false;
	}

	abstract execute(prevState: LoomState): LoomState;
	abstract undo(prevState: LoomState): LoomState;
	abstract redo(prevState: LoomState): LoomState;
}

export default LoomStateCommand;
