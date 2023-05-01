import { Color } from "../../shared/types";
import { TagIdError } from "./error";
import { updateLastEditedTime } from "./row";
import { TableState } from "../../data/types";
import { createTag } from "src/data/modifyTableState";

export const addNewTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	rowId: string,
	markdown: string,
	color: Color,
	canAddMultiple: boolean
) => {
	const { tags, bodyRows } = prevState.model;

	const tagsCopy = structuredClone(tags);

	if (!canAddMultiple) {
		const tag = tagsCopy.find((t) => t.cellIds.find((c) => c === cellId));
		//If there was already a tag selected for this cell
		if (tag) {
			const arr = tag.cellIds.filter((c) => c !== cellId);
			tag.cellIds = arr;
		}
	}

	tagsCopy.push(createTag(columnId, cellId, markdown, color));
	return {
		...prevState,
		model: {
			...prevState.model,
			tags: tagsCopy,
			bodyRows: updateLastEditedTime(bodyRows, rowId),
		},
	};
};

export const removeCellFromTag = (
	prevState: TableState,
	cellId: string,
	rowId: string,
	tagId: string
) => {
	const { tags, bodyRows } = prevState.model;

	const tagsCopy = structuredClone(tags);
	const tag = tagsCopy.find((t) => t.id === tagId);

	if (!tag) throw new TagIdError(tagId);

	const arr = tag.cellIds.filter((c) => c !== cellId);
	tag.cellIds = arr;

	return {
		...prevState,
		model: {
			...prevState.model,
			tags: tagsCopy,
		},
		bodyRows: updateLastEditedTime(bodyRows, rowId),
	};
};

export const addCellToTag = (
	prevState: TableState,
	cellId: string,
	rowId: string,
	tagId: string,
	canAddMultiple: boolean
): TableState => {
	const { tags, bodyRows } = prevState.model;
	const tagsCopy = structuredClone(tags);

	if (!canAddMultiple) {
		const tag = tagsCopy.find((t) => t.cellIds.find((c) => c == cellId));
		if (tag) {
			//If we click on the same cell, then return
			if (tag.id === tagId) return prevState;
			const arr = tag.cellIds.filter((c) => c !== cellId);
			tag.cellIds = arr;
		}
	}

	const tag = tagsCopy.find((t) => t.id === tagId);
	if (!tag) throw new TagIdError(tagId);
	const index = tagsCopy.indexOf(tag);
	tagsCopy[index].cellIds.push(cellId);

	return {
		...prevState,
		model: {
			...prevState.model,
			tags: tagsCopy,
			bodyRows: updateLastEditedTime(bodyRows, rowId),
		},
	};
};

export const updateTagColor = (
	prevState: TableState,
	tagId: string,
	newColor: Color
): TableState => {
	const { tags } = prevState.model;
	const tagsCopy = structuredClone(tags);
	const index = tagsCopy.findIndex((t) => t.id === tagId);
	tagsCopy[index].color = newColor;
	return {
		...prevState,
		model: {
			...prevState.model,
			tags: tagsCopy,
		},
	};
};

export const deleteTag = (prevState: TableState, tagId: string): TableState => {
	const { tags } = prevState.model;
	return {
		...prevState,
		model: {
			...prevState.model,
			tags: tags.filter((tag) => tag.id !== tagId),
		},
	};
};
