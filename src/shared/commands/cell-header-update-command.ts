import { CellNotFoundError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { HeaderCell, TableState } from "../types";

export default class CellHeaderUpdateCommand extends TableStateCommand {
	private cellId: string;
	private key: keyof HeaderCell;
	private value: unknown;

	private previousValue: unknown;

	constructor(cellId: string, key: keyof HeaderCell, value: unknown) {
		super();
		this.cellId = cellId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { headerCells } = prevState.model;
		const cell = headerCells.find((cell) => cell.id === this.cellId);
		if (!cell)
			throw new CellNotFoundError({
				id: this.cellId,
			});
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

	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

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
