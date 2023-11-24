import { cloneDeep } from "lodash";
import { LoomState } from "../types/loom-state";
import CommandPatchError from "./error/command-patch-error";
import CommandRedoError from "./error/command-redo-error";
import CommandUndoError from "./error/command-undo-error";
import jsondiffpatch from "jsondiffpatch";

abstract class LoomStateCommand {
	hasExecuteBeenCalled: boolean = false;
	hasUndoBeenCalled: boolean = false;

	/**
	 * Represents the difference between the original state and the state after execute() is called.
	 * This is used to undo() and redo() the command
	 */
	statePatch: jsondiffpatch.Delta | null = null;

	shouldSortRows: boolean;
	shouldSaveFrontmatter: boolean;

	constructor(
		shouldSortRows: boolean,
		options?: {
			shouldSaveFrontmatter?: boolean;
		}
	) {
		const { shouldSaveFrontmatter = true } = options ?? {};
		this.shouldSortRows = shouldSortRows;
		this.shouldSaveFrontmatter = shouldSaveFrontmatter;
	}

	/**
	 * Should be called after the command is executed
	 * @param prevState - The state before the command is executed
	 * @param nextState - The state after the command is executed
	 */
	finishExecute(prevState: LoomState, nextState: LoomState) {
		this.hasExecuteBeenCalled = true;

		const patch = jsondiffpatch.diff(prevState, nextState);
		if (patch === undefined) throw new Error("No patch changes detected");
		this.statePatch = patch;
	}

	undo(executeState: LoomState): LoomState {
		if (!this.hasExecuteBeenCalled) throw new CommandUndoError();
		if (!this.statePatch) throw new CommandPatchError();
		this.hasUndoBeenCalled = true;

		const stateCopy = cloneDeep(executeState);
		jsondiffpatch.unpatch(stateCopy, this.statePatch);
		return stateCopy;
	}

	redo(undoState: LoomState): LoomState {
		if (!this.hasUndoBeenCalled) throw new CommandRedoError();
		if (!this.statePatch) throw new CommandPatchError();
		this.hasUndoBeenCalled = false;

		const stateCopy = cloneDeep(undoState);
		jsondiffpatch.patch(stateCopy, this.statePatch);
		return stateCopy;
	}

	abstract execute(originalState: LoomState): LoomState;
}

export default LoomStateCommand;
