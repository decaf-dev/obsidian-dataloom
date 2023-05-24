import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { BodyCell, BodyRow, TableState } from "../types/types";

export default class RowAddCommand extends TableStateCommand {
	private addedRow: BodyRow;
	private addedBodyCells: BodyCell[];

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { bodyRows, bodyCells, columns } = prevState.model;

		this.addedRow = createBodyRow(bodyRows.length);
		this.addedBodyCells = columns.map((column) => {
			const { id, type } = column;
			return createBodyCell(id, this.addedRow.id, {
				cellType: type,
			});
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.addedBodyCells],
				bodyRows: [...bodyRows, this.addedRow],
			},
		};
	}

	redo(prevState: TableState): TableState {
		super.onRedo();

		const { bodyRows, bodyCells } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.addedBodyCells],
				bodyRows: [...bodyRows, this.addedRow],
			},
		};
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { bodyRows, bodyCells } = prevState.model;

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyRows: bodyRows.filter((row) => row.id !== this.addedRow.id),
				bodyCells: bodyCells.filter(
					(cell) => cell.rowId !== this.addedRow.id
				),
			},
		};
	}
}
