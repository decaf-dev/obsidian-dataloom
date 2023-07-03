import { CellNotFoundError } from "../dashboard-state/dashboard-error";
import DashboardStateCommand from "../dashboard-state/table-state-command";
import { FooterCell, DashboardState } from "../types";

export default class CellFooterUpdateCommand extends DashboardStateCommand {
	private cellId: string;
	private key: keyof FooterCell;
	private value: unknown;

	private previousValue: unknown;

	constructor(cellId: string, key: keyof FooterCell, value: unknown) {
		super();
		this.cellId = cellId;
		this.key = key;
		this.value = value;
	}

	execute(prevState: DashboardState): DashboardState {
		super.onExecute();

		const { footerCells } = prevState.model;
		const cell = footerCells.find((cell) => cell.id === this.cellId);
		if (!cell)
			throw new CellNotFoundError({
				id: this.cellId,
			});
		this.previousValue = cell[this.key];

		return {
			...prevState,
			model: {
				...prevState.model,
				footerCells: footerCells.map((cell) => {
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

	redo(prevState: DashboardState): DashboardState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: DashboardState): DashboardState {
		super.onUndo();

		const { footerCells } = prevState.model;
		return {
			...prevState,
			model: {
				...prevState.model,
				footerCells: footerCells.map((cell) => {
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
