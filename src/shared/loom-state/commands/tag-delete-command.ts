import LoomStateCommand from "./loom-state-command";
import { Cell, Column, LoomState, Row, Tag } from "../types/loom-state";
import TagNotFoundError from "src/shared/error/tag-not-found-error";

export default class TagDeleteCommand extends LoomStateCommand {
	private tagId: string;
	private columnId: string;

	/**
	 * The tag that was deleted from the column
	 */
	private deletedTag: {
		arrIndex: number;
		tag: Tag;
	};

	/**
	 * The previous cell tag ids before the command is executed
	 */
	private previousCellTagIds: {
		cellId: string;
		tagIds: string[];
	}[] = [];

	constructor(columnId: string, tagId: string) {
		super(true);
		this.columnId = columnId;
		this.tagId = tagId;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { rows, columns } = prevState.model;

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const tag = column.tags.find((tag) => tag.id === this.tagId);
				if (!tag) throw new TagNotFoundError(this.tagId);

				this.deletedTag = {
					arrIndex: column.tags.indexOf(tag),
					tag,
				};

				return {
					...column,
					tags: column.tags.filter((tag) => tag.id !== this.tagId),
				};
			}
			return column;
		});

		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const nextCells: Cell[] = cells.map((cell) => {
				if (cell.tagIds.includes(this.tagId)) {
					this.previousCellTagIds.push({
						cellId: cell.id,
						tagIds: [...cell.tagIds],
					});

					return {
						...cell,
						tagIds: cell.tagIds.filter(
							(tagId) => tagId !== this.tagId
						),
					};
				}
				return cell;
			});
			return {
				...row,
				cells: nextCells,
			};
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

		const { columns, rows } = prevState.model;

		const nextColumns: Column[] = columns.map((column) => {
			if (column.id === this.columnId) {
				const updatedTags = [...column.tags];
				updatedTags.splice(
					this.deletedTag.arrIndex,
					0,
					this.deletedTag.tag
				);

				return {
					...column,
					tags: updatedTags,
				};
			}
			return column;
		});

		//TODO update last edited time for any rows that had a cell with the tag
		const nextRows: Row[] = rows.map((row) => {
			const { cells } = row;
			const newCells = cells.map((cell) => {
				const previousTagIds = this.previousCellTagIds.find(
					(previousCellTagId) => previousCellTagId.cellId === cell.id
				);
				if (previousTagIds) {
					return {
						...cell,
						tagIds: previousTagIds.tagIds,
					};
				}
				return cell;
			});
			return {
				...row,
				cells: newCells,
			};
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
		return this.execute(prevState);
	}
}
