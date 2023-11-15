import { LoomState } from "../types";
import LoomStateCommand from "./loom-state-command";
import { Column, Row } from "../types/loom-state";

export default class ColumnReorderCommand extends LoomStateCommand {
	private dragId: string;
	private targetId: string;

	private dragIndex: number;
	private targetIndex: number;

	constructor(dragId: string, targetId: string) {
		super(false);
		this.dragId = dragId;
		this.targetId = targetId;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { columns } = prevState.model;

		const dragIndex = columns.findIndex(
			(column) => column.id === this.dragId
		);
		const targetIndex = columns.findIndex(
			(column) => column.id === this.targetId
		);

		this.dragIndex = dragIndex;
		this.targetIndex = targetIndex;

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

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { columns } = prevState.model;

		const newColumns = [...columns];
		const draggedEl = newColumns[this.targetIndex];

		//Remove the element
		newColumns.splice(this.targetIndex, 1);
		//Append it to the new location
		newColumns.splice(this.dragIndex, 0, draggedEl);

		const nextRows = this.sortCellsByColumns(
			prevState.model.rows,
			newColumns
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				rows: nextRows,
			},
		};
	}
	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { columns } = prevState.model;
		const newColumns = [...columns];
		const draggedEl = newColumns[this.dragIndex];

		//Remove the element
		newColumns.splice(this.dragIndex, 1);
		//Append it to the new location
		newColumns.splice(this.targetIndex, 0, draggedEl);

		const nextRows = this.sortCellsByColumns(
			prevState.model.rows,
			newColumns
		);

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				rows: nextRows,
			},
		};
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
