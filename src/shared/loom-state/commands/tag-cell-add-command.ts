import LoomStateCommand from "./loom-state-command";
import { Cell, LoomState, Row } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";

export default class TagCellAddCommand extends LoomStateCommand {
	private cellId: string;
	private tagId: string;
	private isMultiTag: boolean;

	private rowId: string;

	private previousCellTagIds: string[];
	private nextCellTagIds: string[];

	private previousEditedTime: number;
	private nextEditedTime: number;

	constructor(cellId: string, tagId: string, isMultiTag: boolean) {
		super(true);
		this.cellId = cellId;
		this.tagId = tagId;
		this.isMultiTag = isMultiTag;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows } = prevState.model;
		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.cellId)
		);
		if (!row) throw new RowNotFoundError();
		this.rowId = row.id;
		this.previousEditedTime = row.lastEditedTime;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { tagIds } = cell;

				let updatedTagIds: string[] = [];
				if (cell.id === this.cellId) {
					this.previousCellTagIds = [...tagIds];

					if (this.isMultiTag === false) {
						updatedTagIds = [this.tagId];
						this.nextCellTagIds = updatedTagIds;
						//If there was already a tag attached to the cell, remove it
						if (tagIds.length > 0) {
							return {
								...cell,
								tagIds: updatedTagIds,
							};
						}
					}
					updatedTagIds = [...tagIds, this.tagId];
					this.nextCellTagIds = updatedTagIds;
					return {
						...cell,
						tagIds: updatedTagIds,
					};
				}
				return cell;
			});

			if (row.id === this.rowId) {
				const newLastEditedTime = Date.now();
				this.nextEditedTime = newLastEditedTime;
				return {
					...row,
					lastEditedTime: newLastEditedTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows } = prevState.model;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.cellId) {
					return {
						...cell,
						tagIds: this.previousCellTagIds,
					};
				}
				return cell;
			});

			if (row.id === this.rowId) {
				return {
					...row,
					lastEditedTime: this.previousEditedTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();

		const { rows } = prevState.model;

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.id === this.cellId) {
					return {
						...cell,
						tagIds: this.nextCellTagIds,
					};
				}
				return cell;
			});

			if (row.id === this.rowId) {
				return {
					...row,
					lastEditedTime: this.nextEditedTime,
					cells: nextCells,
				};
			}
			return row;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				rows: nextRows,
			},
		};
	}
}
