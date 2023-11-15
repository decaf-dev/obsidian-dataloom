import LoomStateCommand from "./loom-state-command";
import { Cell, LoomState, Row } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";
import { getCurrentDateTime } from "src/shared/date/utils";

export default class TagCellRemoveCommand extends LoomStateCommand {
	private cellId: string;
	private tagId: string;

	private rowId: string;

	private previousEditedDateTime: string;
	private nextEditedDateTime: string;

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
		this.previousEditedDateTime = row.lastEditedDateTime;

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
				const newEditedDateTime = getCurrentDateTime();
				this.nextEditedDateTime = newEditedDateTime;
				return {
					...row,
					lastEditedDateTime: newEditedDateTime,
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
					lastEditedDateTime: this.previousEditedDateTime,
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
					lastEditedDateTime: this.nextEditedDateTime,
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
