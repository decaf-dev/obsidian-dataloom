import { TableState } from "../table/types";

import { randomTagId } from "../random";

export const addNewTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	rowId: string,
	markdown: string,
	html: string,
	color: string,
	canAddMultiple: boolean
) => {
	const tags = [...prevState.settings.columns[columnId].tags];

	if (!canAddMultiple) {
		const tag = tags.find((t) =>
			t.cells.find((c) => c.columnId === columnId && c.rowId === rowId)
		);
		//If there was already a tag selected for this cell
		if (tag) {
			const arr = tag.cells.filter(
				(c) => c.columnId !== columnId || c.rowId !== rowId
			);
			tag.cells = arr;
			if (arr.length === 0) tags.splice(tags.indexOf(tag), 1);
		}
	}

	tags.push({
		id: randomTagId(),
		markdown,
		html,
		color,
		cells: [
			{
				rowId,
				columnId,
			},
		],
	});

	return {
		...prevState,
		model: {
			...prevState.model,
			cells: prevState.model.cells.map((cell) => {
				if (cell.id === cellId) {
					let newMarkdown = "";
					if (canAddMultiple && cell.markdown !== "") {
						newMarkdown = cell.markdown + "," + markdown;
					} else {
						newMarkdown = markdown;
					}

					let newHtml = "";
					if (canAddMultiple && cell.html !== "") {
						newHtml = cell.html + "," + html;
					} else {
						newHtml = html;
					}

					return {
						...cell,
						markdown: newMarkdown,
						html: newHtml,
					};
				}
				return cell;
			}),
		},
		settings: {
			...prevState.settings,
			columns: {
				...prevState.settings.columns,
				[columnId]: {
					...prevState.settings.columns[columnId],
					tags,
				},
			},
		},
	};
};

export const removeTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	rowId: string,
	tagId: string
) => {
	const tags = [...prevState.settings.columns[columnId].tags];
	const tag = tags.find((t) => t.id === tagId);
	const arr = tag.cells.filter(
		(c) => c.columnId !== columnId || c.rowId !== rowId
	);
	tag.cells = arr;

	const assignedTags = tags.filter((tag) =>
		tag.cells.find((c) => c.columnId === columnId && c.rowId === rowId)
	);
	const newMarkdown = assignedTags.map((t) => t.markdown).join(",");
	const newHtml = assignedTags.map((t) => t.html).join(",");
	return {
		...prevState,
		model: {
			...prevState.model,
			cells: prevState.model.cells.map((cell) => {
				if (cell.id === cellId) {
					return {
						...cell,
						markdown: newMarkdown,
						html: newHtml,
					};
				}
				return cell;
			}),
		},
		settings: {
			...prevState.settings,
			columns: {
				...prevState.settings.columns,
				[columnId]: {
					...prevState.settings.columns[columnId],
					tags,
				},
			},
		},
	};
};

export const addExistingTag = (
	prevState: TableState,
	cellId: string,
	columnId: string,
	rowId: string,
	tagId: string,
	canAddMultiple: boolean
) => {
	const tags = [...prevState.settings.columns[columnId].tags];

	if (!canAddMultiple) {
		const tag = tags.find((t) =>
			t.cells.find((c) => c.columnId === columnId && c.rowId === rowId)
		);
		if (tag) {
			//If we click on the same cell, then return
			if (tag.id === tagId) return prevState;
			const arr = tag.cells.filter(
				(c) => c.columnId !== columnId || c.rowId !== rowId
			);
			tag.cells = arr;
			if (arr.length === 0) tags.splice(tags.indexOf(tag), 1);
		}
	}

	const tag = tags.find((t) => t.id === tagId);
	const index = tags.indexOf(tag);
	tags[index].cells.push({
		rowId,
		columnId,
	});

	return {
		...prevState,
		model: {
			...prevState.model,
			cells: prevState.model.cells.map((cell) => {
				if (cell.id === cellId) {
					let newMarkdown = "";
					if (canAddMultiple && cell.markdown !== "") {
						newMarkdown = cell.markdown + "," + tag.markdown;
					} else {
						newMarkdown = tag.markdown;
					}

					let newHtml = "";
					if (canAddMultiple && cell.html !== "") {
						newHtml = cell.html + "," + tag.html;
					} else {
						newHtml = tag.html;
					}

					return {
						...cell,
						markdown: newMarkdown,
						html: newHtml,
					};
				}
				return cell;
			}),
		},
		settings: {
			...prevState.settings,
			columns: {
				...prevState.settings.columns,
				[columnId]: {
					...prevState.settings.columns[columnId],
					tags,
				},
			},
		},
	};
};
