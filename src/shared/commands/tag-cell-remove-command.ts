import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";
import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../types/types";

export default class TagCellRemoveCommand extends TableStateCommand {
	private cellId: string;
	private rowId: string;
	private tagId: string;

	private previousEditedTime: number;
	private changedTag: Tag;

	constructor(cellId: string, rowId: string, tagId: string) {
		super();
		this.cellId = cellId;
		this.rowId = rowId;
		this.tagId = tagId;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { tags, bodyRows } = prevState.model;

		let updatedTags = structuredClone(tags);
		updatedTags = updatedTags.map((tag) => {
			if (tag.id === this.tagId) {
				this.changedTag = structuredClone(tag);
				return {
					...tag,
					cellIds: tag.cellIds.filter((id) => id !== this.cellId),
				};
			}
			return tag;
		});

		this.previousEditedTime = rowLastEditedTime(bodyRows, this.rowId);

		//TODO fix the newEditedTime for all commands
		// this.newEditedTime = Date.now();

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
			if (tag.id === this.changedTag.id) return this.changedTag;
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
