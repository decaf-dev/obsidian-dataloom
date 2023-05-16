import { createTag } from "src/data/table-state-factory";
import TableStateCommand from "../table-state/table-state-command";
import { TableState, Tag } from "../table-state/types";
import { Color } from "../types";
import {
	rowLastEditedTime,
	rowLastEditedTimeUpdate,
} from "../table-state/row-state-operations";

export default class TagAddCommand extends TableStateCommand {
	private cellId: string;
	private columnId: string;
	private rowId: string;
	private markdown: string;
	private color: Color;
	private isMultiTag: boolean;

	private previousEditedTime: number;
	private newEditedTime: number;
	private newTag: Tag;
	private changedTag?: Tag;

	constructor(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		super();
		this.cellId = cellId;
		this.columnId = columnId;
		this.rowId = rowId;
		this.markdown = markdown;
		this.color = color;
		this.isMultiTag = isMultiTag;
	}

	execute(prevState: TableState): TableState {
		super.onExecute();

		const { tags, bodyRows } = prevState.model;

		const updatedTags = structuredClone(tags);

		//If there was already a tag attached to the cell, remove it
		if (!this.isMultiTag) {
			const cellTag = updatedTags.find((tag) =>
				tag.cellIds.find((c) => c === this.cellId)
			);
			if (cellTag) {
				this.changedTag = structuredClone(cellTag);
				cellTag.cellIds = cellTag.cellIds.filter(
					(c) => c !== this.cellId
				);
			}
		}

		this.newTag = createTag(this.columnId, this.markdown, {
			color: this.color,
			cellId: this.cellId,
		});
		updatedTags.push(this.newTag);

		this.previousEditedTime = rowLastEditedTime(bodyRows, this.rowId);
		this.newEditedTime = Date.now();

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: updatedTags,
				bodyRows: rowLastEditedTimeUpdate(
					bodyRows,
					this.rowId,
					this.newEditedTime
				),
			},
		};
	}
	redo(prevState: TableState): TableState {
		super.onRedo();
		const { tags, bodyRows } = prevState.model;

		let updatedTags = structuredClone(tags);
		updatedTags = updatedTags.map((tag) => {
			if (tag.id === this.changedTag?.id) {
				return {
					...tag,
					cellIds: tag.cellIds.filter((c) => c !== this.cellId),
				};
			}
			return tag;
		});
		updatedTags.push(this.newTag);

		return {
			...prevState,
			model: {
				...prevState.model,
				tags: updatedTags,
				bodyRows: rowLastEditedTimeUpdate(
					bodyRows,
					this.rowId,
					this.newEditedTime
				),
			},
		};
	}
	undo(prevState: TableState): TableState {
		super.onUndo();

		const { bodyRows, tags } = prevState.model;
		let updatedTags = structuredClone(tags);
		updatedTags = updatedTags
			.filter((tag) => tag.id !== this.newTag.id)
			.map((tag) => {
				if (tag.id == this.changedTag?.id) return this.changedTag;
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
