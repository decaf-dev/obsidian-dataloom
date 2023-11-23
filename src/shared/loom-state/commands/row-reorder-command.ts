import { LoomState } from "../types";
import { SortDir } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class RowReorderCommand extends LoomStateCommand {
	private dragId: string;
	private targetId: string;

	constructor(dragId: string, targetId: string) {
		super(false);
		this.dragId = dragId;
		this.targetId = targetId;
	}

	execute(prevState: LoomState): LoomState {
		const { rows, columns } = prevState.model;

		const dragIndex = rows.findIndex((row) => row.id === this.dragId);
		const targetIndex = rows.findIndex((row) => row.id === this.targetId);

		let newRows = [...rows];
		const draggedEl = newRows[dragIndex];

		//Remove the element
		newRows.splice(dragIndex, 1);
		//Append it to the new location
		newRows.splice(targetIndex, 0, draggedEl);

		//Set the current index of all the values to their current positions
		//This will allow us to retain the order of sorted rows once we drag an item
		newRows = newRows.map((row, i) => {
			return {
				...row,
				index: i,
			};
		});

		const nextColumns = columns.map((column) => {
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
				columns: nextColumns,
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}
}
