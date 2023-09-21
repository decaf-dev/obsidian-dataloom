import CellNotFoundError from "src/shared/error/cell-not-found-error";
import LoomStateCommand from "./loom-state-command";
import { FooterCell, LoomState } from "../types/loom-state";

export default class CellFooterUpdateCommand extends LoomStateCommand {
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

	execute(prevState: LoomState): LoomState {
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

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
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
