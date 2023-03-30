import { ColumnIdError, TagIdError } from "./error";
import StateFactory from "./StateFactory";
import { TableState } from "./types";

export const addNewTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	markdown: string,
	color: string,
	canAddMultiple: boolean
) => {
	const { columns } = prevState.model;
	const column = columns.find((column) => column.id === columnId);
	if (!column) throw new ColumnIdError(columnId);

	const tagsCopy = [...column.tags];

	if (!canAddMultiple) {
		const tag = tagsCopy.find((t) => t.cells.find((c) => c === cellId));
		//If there was already a tag selected for this cell
		if (tag) {
			const arr = tag.cells.filter((c) => c !== cellId);
			tag.cells = arr;
		}
	}

	tagsCopy.push(StateFactory.createTag(cellId, markdown, color));
	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.map((column) => {
				if (column.id === columnId) {
					return {
						...column,
						tags: tagsCopy,
					};
				}
				return column;
			}),
		},
	};
};

export const removeTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	tagId: string
) => {
	const { columns } = prevState.model;
	const column = columns.find((column) => column.id === columnId);
	if (!column) throw new ColumnIdError(columnId);

	const tagsCopy = [...column.tags];
	const tag = tagsCopy.find((t) => t.id === tagId);

	if (!tag) throw new TagIdError(tagId);

	const arr = tag.cells.filter((c) => c !== cellId);
	tag.cells = arr;

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.map((column) => {
				if (column.id === columnId) {
					return {
						...column,
						tags: tagsCopy,
					};
				}
				return column;
			}),
		},
	};
};

export const addExistingTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	tagId: string,
	canAddMultiple: boolean
): TableState => {
	const { columns, cells } = prevState.model;
	const column = columns.find((column) => column.id === columnId);

	if (!column) throw new ColumnIdError(columnId);

	const tagsCopy = [...column.tags];

	if (!canAddMultiple) {
		const tag = tagsCopy.find((t) => t.cells.find((c) => c == cellId));
		if (tag) {
			//If we click on the same cell, then return
			if (tag.id === tagId) return prevState;
			const arr = tag.cells.filter((c) => c !== cellId);
			tag.cells = arr;
		}
	}

	const tag = tagsCopy.find((t) => t.id === tagId);
	if (!tag) throw new TagIdError(tagId);
	const index = tagsCopy.indexOf(tag);
	tagsCopy[index].cells.push(cellId);

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: columns.map((column) => {
				if (column.id === columnId) {
					return {
						...column,
						tags: tagsCopy,
					};
				}
				return column;
			}),
		},
	};
};
