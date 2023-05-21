import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";
import { TagIdError } from "../table-state/table-error";
import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../types/types";

export default class TagCellAddCommand extends TableStateCommand {
	private cellId: string;
	private rowId: string;
	private tagId: string;
	private isMultiTag: boolean;

	private changedTags: Tag[] = [];

	constructor(
		cellId: string,
		rowId: string,
		tagId: string,
		isMultiTag: boolean
	) {
		super();
		this.cellId = cellId;
		this.rowId = rowId;
		this.tagId = tagId;
		this.isMultiTag = isMultiTag;
	}

	private previousEditedTime: number;

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { tags, bodyRows } = prevState.model;
		let updatedTags = structuredClone(tags);

		if (!this.isMultiTag) {
			const tag = updatedTags.find((t) =>
				t.cellIds.find((c) => c == this.cellId)
			);
			if (tag) {
				this.changedTags.push(structuredClone(tag));
				// //If we click on the same cell, then return
				// if (tag.id === this.tagId) return prevState;
				tag.cellIds = tag.cellIds.filter((c) => c !== this.cellId);
			}
		}

		updatedTags = updatedTags.map((tag) => {
			if (tag.id === this.tagId) {
				this.changedTags.push(structuredClone(tag));
				return {
					...tag,
					cellIds: [...tag.cellIds, this.cellId],
				};
			}
			return tag;
		});

		this.previousEditedTime = rowLastEditedTime(bodyRows, this.rowId);

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: updatedTags,
				bodyRows: rowLastEditedTimeUpdate(bodyRows, this.rowId),
			},
		};
	}
	redo(prevState: TableState): TableState {
		super.onRedo();
		return this.execute(prevState);
	}

	undo(prevState: TableState): TableState {
		super.onUndo();

		const { tags, bodyRows } = prevState.model;
		let updatedTags = structuredClone(tags);

		updatedTags = updatedTags.map((tag) => {
			const found = this.changedTags.find((t) => t.id === tag.id);
			if (found) return found;
			return tag;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: updatedTags,
				bodyRows: rowLastEditedTimeUpdate(
					bodyRows,
					this.rowId,
					this.previousEditedTime
				),
			},
		};
	}
}
