import { CommandRedoError, CommandUndoError } from "../commands/command-errors";
import { DashboardState } from "../types";

export default abstract class DashboardStateCommand {
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

	abstract execute(prevState: DashboardState): DashboardState;
	abstract redo(prevState: DashboardState): DashboardState;
	abstract undo(prevState: DashboardState): DashboardState;
}
