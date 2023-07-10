import { CommandRedoError, CommandUndoError } from "../commands/command-errors";
import { TableState } from "../types";

export default abstract class TableStateCommand {
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

	abstract execute(prevState: TableState): TableState;
	abstract redo(prevState: TableState): TableState;
	abstract undo(prevState: TableState): TableState;
}
