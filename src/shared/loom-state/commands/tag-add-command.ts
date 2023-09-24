import { createTag } from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { Cell, Column, LoomState, Row, Tag } from "../types/loom-state";
import { Color } from "../types/loom-state";
import RowNotFoundError from "src/shared/error/row-not-found-error";

export default class TagAddCommand extends LoomStateCommand {
	private cellId: string;
	private columnId: string;

	private rowId: string;
	private markdown: string;
	private color: Color;
	private isMultiTag: boolean;

	/**
	 * The edited time of the row before the command is executed
	 */
	private previousEditedTime: number;

	/**
	 * The edited time of the row after the command is executed
	 *
	 */
	private nextEditedTime: number;

	/**
	 * The tag that was added to the column
	 */
	private addedTag: Tag;

	/**
	 * The cell tag ids before the command is executed
	 */
	private previousCellTagIds: string[];

	/**
	 * The cell tag ids after the command is executed
	 */
	private nextCellTagIds: string[];

	constructor(
		cellId: string,
		columnId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		super(true);
		this.cellId = cellId;
		this.columnId = columnId;
		this.markdown = markdown;
		this.color = color;
		this.isMultiTag = isMultiTag;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, columns } = prevState.model;
		const row = rows.find((row) =>
			row.cells.find((cell) => cell.id === this.cellId)
		);
		if (!row) throw new RowNotFoundError();
		this.previousEditedTime = row.lastEditedTime;
		this.rowId = row.id;

		const newTag = createTag(this.markdown, {
			color: this.color,
		});
		this.addedTag = newTag;
		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					tags: [...column.tags, newTag],
				};
			}
			return column;
		});

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				const { id, tagIds } = cell;
				if (id === this.cellId) {
					this.previousCellTagIds = [...tagIds];

					let updatedTagIds: string[] = [];
					if (this.isMultiTag === false) {
						//If there was already a tag attached to the cell, remove it
						if (cell.tagIds.length > 0) {
							updatedTagIds = [newTag.id];
							this.nextCellTagIds = updatedTagIds;
							return {
								...cell,
								tagIds: updatedTagIds,
							};
						}
					}

					updatedTagIds = [...tagIds, newTag.id];
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
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows, columns } = prevState.model;

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					tags: column.tags.filter(
						(tag) => tag.id !== this.addedTag.id
					),
				};
			}
			return column;
		});

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
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
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		const { rows, columns } = prevState.model;

		const nextColumns = columns.map((column) => {
			if (column.id === this.columnId)
				return {
					...column,
					tags: [...column.tags, this.addedTag],
				};
			return column;
		});

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells = cells.map((cell) => {
				if (cell.id === this.cellId)
					return {
						...cell,
						tagIds: this.nextCellTagIds,
					};
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
				columns: nextColumns,
				rows: nextRows,
			},
		};
	}
}
