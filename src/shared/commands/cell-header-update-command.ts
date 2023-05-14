import { CellNotFoundError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { HeaderCell, TableState } from "../table-state/types";
import { CommandUndoError } from "./command-errors";

export default class CellHeaderUpdateCommand implements TableStateCommand {
	cellId: string;
	key: keyof HeaderCell;
	value: unknown;

	constructor(cellId: string, key: keyof HeaderCell, value: unknown) {
		this.cellId = cellId;
		this.key = key;
		this.value = value;
	}

	previousValue?: unknown;

	execute(prevState: TableState): TableState {
		const { headerCells } = prevState.model;
		const cell = headerCells.find((cell) => cell.id === this.cellId);
		if (!cell) throw new CellNotFoundError();
		this.previousValue = cell[this.key];

		return {
			...prevState,
			model: {
				...prevState.model,
				headerCells: headerCells.map((cell) => {
					if (cell.id === this.cellId) {
						return {
							...cell,
							[this.key]: this.value,
						};
					}
					return cell;
				}),
			},
		};
	}

	undo(prevState: TableState): TableState {
		if (this.previousValue === undefined) throw new CommandUndoError();

		const { headerCells } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				headerCells: headerCells.map((cell) => {
					if (cell.id === this.cellId) {
						return {
							...cell,
							[this.key]: this.previousValue,
						};
					}
					return cell;
				}),
			},
		};
	}
}
