import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";
import { CellNotFoundError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { BodyCell, TableState } from "../types/types";

export default class CellBodyUpdateCommand extends TableStateCommand {
	private cellId: string;
	private rowId: string;
	private key: keyof BodyCell;
	private value: unknown;

	private previousValue: unknown;
	private previousEditedTime: number;

	constructor(
		cellId: string,
		rowId: string,
		key: keyof BodyCell,
		value: unknown
	) {
		super(true);
		this.cellId = cellId;
		this.rowId = rowId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { bodyCells, bodyRows } = prevState.model;
		const cell = bodyCells.find((cell) => cell.id === this.cellId);
		if (!cell)
			throw new CellNotFoundError({
				id: this.cellId,
			});
		this.previousValue = cell[this.key];
		this.previousEditedTime = rowLastEditedTime(bodyRows, this.rowId);

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: bodyCells.map((cell) => {
					if (cell.id === this.cellId) {
						return {
							...cell,
							[this.key]: this.value,
						};
					}
					return cell;
				}),
				bodyRows: rowLastEditedTimeUpdate(bodyRows, this.rowId),
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { bodyCells, bodyRows } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: bodyCells.map((cell) => {
					if (cell.id === this.cellId) {
						return {
							...cell,
							[this.key]: this.previousValue,
						};
					}
					return cell;
				}),
				bodyRows: rowLastEditedTimeUpdate(
					bodyRows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
