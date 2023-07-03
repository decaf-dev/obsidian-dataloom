import { createBodyCell, createBodyRow } from "src/data/table-state-factory";
import DashboardStateCommand from "../dashboard-state/dashboard-state-command";
import { BodyCell, BodyRow, DashboardState } from "../types";

export default class RowAddCommand extends DashboardStateCommand {
	private addedRow: BodyRow;
	private addedBodyCells: BodyCell[];

	constructor() {
		super(true);
	}

	execute(prevState: DashboardState): DashboardState {
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

	redo(prevState: DashboardState): DashboardState {
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

	undo(prevState: DashboardState): DashboardState {
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
