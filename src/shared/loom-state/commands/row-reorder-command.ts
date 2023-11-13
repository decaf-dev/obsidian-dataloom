import ColumnNotFoundError from "src/shared/error/column-not-found-error";
import { LoomState } from "../types";
import { SortDir } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class RowReorderCommand extends LoomStateCommand {
	private dragId: string;
	private targetId: string;

	private dragIndex: number;
	private targetIndex: number;

	private previousColumnSort: {
		id: string;
		sortDir: SortDir;
	}[] = [];

	private previousRowOrder: {
		id: string;
		index: number;
	}[] = [];

	constructor(dragId: string, targetId: string) {
		super(false);
		this.dragId = dragId;
		this.targetId = targetId;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, columns } = prevState.model;

		const dragIndex = rows.findIndex((row) => row.id === this.dragId);
		const targetIndex = rows.findIndex((row) => row.id === this.targetId);

		this.dragIndex = dragIndex;
		this.targetIndex = targetIndex;

		let newRows = [...rows];
		const draggedEl = newRows[dragIndex];

		//Remove the element
		newRows.splice(dragIndex, 1);
		//Append it to the new location
		newRows.splice(targetIndex, 0, draggedEl);

		//Set the current index of all the values to their current positions
		//This will allow us to retain the order of sorted rows once we drag an item
		newRows = newRows.map((row, i) => {
			const { id, index } = row;
			this.previousRowOrder.push({
				id,
				index,
			});
			return {
				...row,
				index: i,
			};
		});

		const nextColumns = columns.map((column) => {
			const { id, sortDir } = column;
			//If we're sorting, reset the sort
			this.previousColumnSort.push({
				id,
				sortDir,
			});
			return {
				...column,
				sortDir: SortDir.NONE,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
				columns: nextColumns,
			},
		};
	}
	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows, columns } = prevState.model;

		let newRows = [...rows];
		const draggedEl = newRows[this.targetIndex];

		//Remove the element
		newRows.splice(this.targetIndex, 1);
		//Append it to the new location
		newRows.splice(this.dragIndex, 0, draggedEl);

		//Set the current index of all the values to their current positions
		//This will allow us to retain the order of sorted rows once we drag an item
		newRows = newRows.map((row) => {
			const previousRowOrder = this.previousRowOrder.find(
				(order) => order.id === row.id
			);
			if (!previousRowOrder) throw new Error("Row order not found");
			return {
				...row,
				index: previousRowOrder.index,
			};
		});

		const nextColumns = columns.map((column) => {
			const { id } = column;
			const previousSort = this.previousColumnSort.find(
				(sort) => sort.id === id
			);
			if (!previousSort) throw new ColumnNotFoundError({ id });
			return {
				...column,
				sortDir: previousSort.sortDir,
			};
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: newRows,
				columns: nextColumns,
			},
		};
	}
	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
