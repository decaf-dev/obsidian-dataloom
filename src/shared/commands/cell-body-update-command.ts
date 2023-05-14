import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";
import { CellNotFoundError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { BodyCell, TableState } from "../table-state/types";
import { CommandUndoError } from "./command-errors";

export default class CellBodyUpdateCommand implements TableStateCommand {
	cellId: string;
	rowId: string;
	key: keyof BodyCell;
	value: unknown;

	constructor(
		cellId: string,
		rowId: string,
		key: keyof BodyCell,
		value: unknown
	) {
		this.cellId = cellId;
		this.rowId = rowId;
		this.key = key;
		this.value = value;
	}

	previousValue?: unknown;
	previousEditedTime?: number;

	execute(prevState: TableState): TableState {
		const { bodyCells, bodyRows } = prevState.model;
		const cell = bodyCells.find((cell) => cell.id === this.cellId);
		if (!cell) throw new CellNotFoundError();
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
				bodyRows: rowLastEditedTimeUpdate(
					bodyRows,
					this.rowId,
					Date.now()
				),
			},
		};
	}

	undo(prevState: TableState): TableState {
		if (
			this.previousValue === undefined ||
			this.previousEditedTime === undefined
		)
			throw new CommandUndoError();

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
