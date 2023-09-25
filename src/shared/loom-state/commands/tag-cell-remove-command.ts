import LoomStateCommand from "./loom-state-command";
import { Cell, LoomState, Row } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";

export default class TagCellRemoveCommand extends LoomStateCommand {
	private cellId: string;
	private tagId: string;

	private rowId: string;

	private previousEditedTime: number;
	private nextEditedTime: number;

	/**
	 * The index of the tag id in the tag ids array before the command is executed
	 */
	private previousTagIdIndex: number;

	constructor(cellId: string, tagId: string) {
		super(true);
		this.cellId = cellId;
		this.tagId = tagId;
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
				if (cell.id === this.cellId) {
					const { tagIds } = cell;

					this.previousTagIdIndex = tagIds.indexOf(this.tagId);
					const nextTagIds = tagIds.filter((id) => id !== this.tagId);
					return {
						...cell,
						tagIds: nextTagIds,
					};
				}
				return cell;
			});
			if (row.id === this.rowId) {
				const newEditedTime = Date.now();
				this.nextEditedTime = newEditedTime;
				return {
					...row,
					lastEditedTime: newEditedTime,
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
					const { tagIds } = cell;
					const nextTagIds = [...tagIds];
					nextTagIds.splice(this.previousTagIdIndex, 0, this.tagId);
					return {
						...cell,
						tagIds: nextTagIds,
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
					const { tagIds } = cell;

					const nextTagIds = tagIds.filter((id) => id !== this.tagId);
					return {
						...cell,
						tagIds: nextTagIds,
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
