import TableStateCommand from "../table-state/table-state-command";
import { TableState } from "../table-state/types";

class TagCellAddCommand extends TableStateCommand {
	execute(prevState: TableState): TableState {
		throw new Error("Method not implemented.");
	}
	redo(prevState: TableState): TableState {
		throw new Error("Method not implemented.");
	}
	undo(prevState: TableState): TableState {
		throw new Error("Method not implemented.");
	}
}
