import { TableState } from "./types";

export default interface TableStateCommand {
	execute(prevState: TableState): TableState;
	redo?(prevState: TableState): TableState;
	undo(prevState: TableState): TableState;
}
