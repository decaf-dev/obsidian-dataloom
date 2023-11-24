import LoomStateCommand from "./loom-state-command";
import { Cell, LoomState, Row } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import { getCurrentDateTime } from "src/shared/date/utils";

export default class CellBodyUpdateCommand extends LoomStateCommand {
	private id: string;
	private data: Partial<Cell>;
	private isPartial: boolean;

	constructor(id: string, data: Partial<Cell>, isPartial = true) {
		super(true);
		this.id = id;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		//Set the rowId of the cell
		const { rows } = prevState.model;
		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.id)
		);
		if (!row) throw new RowNotFoundError();
		const targetRowId = row.id;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.id) {
					let newCell: Cell = this.data as Cell;
					if (this.isPartial)
						newCell = { ...cell, ...this.data } as Cell;
					return newCell;
				}
				return cell;
			});

			if (row.id === targetRowId) {
				return {
					...row,
					lastEditedDateTime: getCurrentDateTime(),
					cells: nextCells,
				};
			}
			return row;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
