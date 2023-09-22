import { rowLastEditedTime, rowLastEditedTimeUpdate } from "../row-utils";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import LoomStateCommand from "./loom-state-command";
import { BodyCell, LoomState } from "../types/loom-state";

export default class CellBodyUpdateCommand extends LoomStateCommand {
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

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { bodyCells, rows } = prevState.model;
		const cell = bodyCells.find((cell) => cell.id === this.cellId);
		if (!cell)
			throw new CellNotFoundError({
				id: this.cellId,
			});
		this.previousValue = cell[this.key];
		this.previousEditedTime = rowLastEditedTime(rows, this.rowId);

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
				rows: rowLastEditedTimeUpdate(rows, this.rowId),
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { bodyCells, rows } = prevState.model;
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
				rows: rowLastEditedTimeUpdate(
					rows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
