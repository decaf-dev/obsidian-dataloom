import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";
import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../types/types";

export default class TagCellMultipleRemoveCommand extends TableStateCommand {
	private cellId: string;
	private rowId: string;
	private tagIds: string[];

	private previousEditedTime: number;
	private changedTags: Tag[] = [];

	constructor(cellId: string, rowId: string, tagIds: string[]) {
		super();
		this.cellId = cellId;
		this.rowId = rowId;
		this.tagIds = tagIds;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { tags, bodyRows } = prevState.model;

		let updatedTags = structuredClone(tags);
		updatedTags = updatedTags.map((tag) => {
			if (this.tagIds.includes(tag.id)) {
				this.changedTags.push(structuredClone(tag));
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
		updatedTags = updatedTags.map(
			(tag) => this.changedTags.find((t) => t.id === tag.id) || tag
		);

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
