import { CommandRedoError, CommandUndoError } from "../commands/command-errors";
import { TableState } from "../types/types";

export default abstract class TableStateCommand {
	hasExecuteBeenCalled: boolean = false;
	hasUndoBeenCalled: boolean = false;

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
