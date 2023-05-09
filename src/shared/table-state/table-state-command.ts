import { TableState } from "./types";

export default interface TableStateCommand {
	execute(state: TableState): TableState;
	undo(state: TableState): TableState;
}
