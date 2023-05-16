import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { BodyCell, BodyRow, TableState } from "../table-state/types";

export default class RowAddCommand extends TableStateCommand {
	private newRow: BodyRow;
	private newBodyCells: BodyCell[];

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { bodyRows, bodyCells, columns } = prevState.model;

		this.newRow = createBodyRow(bodyRows.length);
		this.newBodyCells = columns.map((column) => {
			const { id, type } = column;
			return createBodyCell(id, this.newRow.id, {
				cellType: type,
			});
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				bodyCells: [...bodyCells, ...this.newBodyCells],
				bodyRows: [...bodyRows, this.newRow],
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
				bodyCells: [...bodyCells, ...this.newBodyCells],
				bodyRows: [...bodyRows, this.newRow],
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
				bodyRows: bodyRows.filter((row) => row.id !== this.newRow.id),
				bodyCells: bodyCells.filter(
					(cell) => cell.rowId !== this.newRow.id
				),
			},
		};
	}
}
