import { LoomState } from "../types";
import LoomStateCommand from "./loom-state-command";
import { Column, Row } from "../types/loom-state";

export default class ColumnReorderCommand extends LoomStateCommand {
	private dragId: string;
	private targetId: string;

	constructor(dragId: string, targetId: string) {
		super(false);
		this.dragId = dragId;
		this.targetId = targetId;
	}

	execute(prevState: LoomState): LoomState {
		const { columns } = prevState.model;

		const dragIndex = columns.findIndex(
			(column) => column.id === this.dragId
		);
		const targetIndex = columns.findIndex(
			(column) => column.id === this.targetId
		);

		const newColumns = [...columns];
		const draggedEl = newColumns[dragIndex];

		//Remove the element
		newColumns.splice(dragIndex, 1);
		//Append it to the new location
		newColumns.splice(targetIndex, 0, draggedEl);

		const nextRows = this.sortCellsByColumns(
			prevState.model.rows,
			newColumns
		);

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				rows: nextRows,
			},
		};
		this.onExecute(prevState, nextState);
		return nextState;
	}

	private sortCellsByColumns(prevRows: Row[], columns: Column[]): Row[] {
		return prevRows.map((row) => {
			const { cells } = row;
			const nextCells = cells.sort((a, b) => {
				const aIndex = columns.findIndex(
					(column) => column.id === a.columnId
				);
				const bIndex = columns.findIndex(
					(column) => column.id === b.columnId
				);
				return aIndex - bIndex;
			});
			return {
				...row,
				cells: nextCells,
			};
		});
	}
}
