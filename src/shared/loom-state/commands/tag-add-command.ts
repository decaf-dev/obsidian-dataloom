import { createTag } from "src/shared/loom-state/loom-state-factory";
import LoomStateCommand from "./loom-state-command";
import { LoomState, Tag } from "../types/loom-state";
import { Color } from "../types/loom-state";
import { rowLastEditedTime, rowLastEditedTimeUpdate } from "../row-utils";

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
	private newEditedTime: number;

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
	private newCellTagIds: string[];

	constructor(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		super(true);
		this.cellId = cellId;
		this.columnId = columnId;
		this.rowId = rowId;
		this.markdown = markdown;
		this.color = color;
		this.isMultiTag = isMultiTag;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, bodyCells, columns } = prevState.model;

		this.addedTag = createTag(this.markdown, {
			color: this.color,
		});

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId) {
				return {
					...column,
					tags: [...column.tags, this.addedTag],
				};
			}
			return column;
		});

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				this.previousCellTagIds = [...cell.tagIds];

				if (this.isMultiTag === false) {
					//If there was already a tag attached to the cell, remove it
					if (cell.tagIds.length > 0) {
						this.newCellTagIds = [this.addedTag.id];
						return {
							...cell,
							tagIds: this.newCellTagIds,
						};
					}
				}

				this.newCellTagIds = [...cell.tagIds, this.addedTag.id];

				return {
					...cell,
					tagIds: [...cell.tagIds, this.addedTag.id],
				};
			}
			return cell;
		});

		this.previousEditedTime = rowLastEditedTime(rows, this.rowId);
		this.newEditedTime = Date.now();

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				rows: rowLastEditedTimeUpdate(
					rows,
					this.rowId,
					this.newEditedTime
				),
			},
		};
	}
	redo(prevState: LoomState): LoomState {
		super.onRedo();
		const { rows, columns, bodyCells } = prevState.model;

		const newColumns = columns.map((column) => {
			if (column.id === this.columnId)
				return {
					...column,
					tags: [...column.tags, this.addedTag],
				};
			return column;
		});

		const newBodyCells = bodyCells.map((cell) => {
			if (cell.id === this.cellId)
				return {
					...cell,
					tagIds: this.newCellTagIds,
				};
			return cell;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				rows: rowLastEditedTimeUpdate(
					rows,
					this.rowId,
					this.newEditedTime
				),
			},
		};
	}
	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { rows, columns } = prevState.model;

		const newColumns = columns.map((column) => {
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

		const newBodyCells = prevState.model.bodyCells.map((cell) => {
			if (cell.id === this.cellId) {
				return {
					...cell,
					tagIds: this.previousCellTagIds,
				};
			}
			return cell;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				columns: newColumns,
				bodyCells: newBodyCells,
				rows: rowLastEditedTimeUpdate(
					rows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
