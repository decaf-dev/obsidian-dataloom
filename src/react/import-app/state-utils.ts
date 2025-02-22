import { dateStringToDateTime } from "src/shared/date/date-string-conversion";
import { isValidDateString } from "src/shared/date/date-validation";
import {
	createCheckboxCell,
	createColumn,
	createCreationTimeCell,
	createDateCell,
	createEmbedCell,
	createFileCell,
	createLastEditedTimeCell,
	createMultiTagCell,
	createNumberCell,
	createRow,
	createSourceCell,
	createSourceFileCell,
	createTag,
	createTagCell,
	createTextCell,
} from "src/shared/loom-state/loom-state-factory";
import {
	type Cell,
	CellType,
	type Column,
	DateFormat,
	DateFormatSeparator,
	type LoomState,
	type Row,
	type Tag,
} from "src/shared/loom-state/types/loom-state";
import { NEW_COLUMN_ID } from "./constants";
import type { ColumnMatch, ImportData } from "./types";

export const addImportData = (
	prevState: LoomState,
	data: ImportData,
	columnMatches: ColumnMatch[],
	dateFormat: DateFormat | null,
	dateFormatSeparator: DateFormatSeparator | null
): LoomState => {
	const { rows, columns } = prevState.model;

	//The first index is the header row
	//We want only the data rows
	const importRows = data.slice(1);

	//Create a column for each column that does not have a match
	const newColumns: Column[] = [];
	columnMatches.forEach((match) => {
		if (match.columnId === NEW_COLUMN_ID) {
			const column = createColumn();
			newColumns.push(column);
			match.columnId = column.id;
		}
	});
	const nextColumns = [...columns, ...newColumns];

	//Add a cell for each new column
	const updatedRows = rows.map((row) => {
		const { cells } = row;
		const newCells = [...cells];
		newColumns.forEach((column) => {
			const cell = createTextCell(column.id);
			newCells.push(cell);
		});
		return {
			...row,
			cells: newCells,
		};
	});

	//Create a new row for each import data entry
	const newRows: Row[] = Array(importRows.length)
		.fill(null)
		.map((_val, i) => {
			const newRow = createRow(rows.length + i);

			const importRow = importRows[i];

			const nextCells: Cell[] = [];
			//This represents the columns in the current data
			nextColumns.forEach((column) => {
				const { id: columnId, type, tags: columnTags } = column;
				const match = columnMatches.find(
					(match) => match.columnId === columnId
				);

				//For each row we create, we need to create a cell. However,
				//only those cells that have a match will have a value
				let content = "";
				let newCell: Cell | null = null;
				if (match) {
					const { importColumnIndex } = match;
					content = importRow[importColumnIndex];
					if (content !== undefined && content !== null) {
						content = content.trim();
					}
				}

				if (type === CellType.TAG) {
					const { cell, newTags } = findTagCell(
						columnTags,
						columnId,
						content
					);
					newCell = cell;
					columnTags.push(...newTags);
				} else if (type === CellType.MULTI_TAG) {
					const { cell, newTags } = findMultiTagCell(
						columnTags,
						columnId,
						content
					);
					newCell = cell;
					columnTags.push(...newTags);
				} else if (type === CellType.DATE) {
					const cell = findDateCell(
						columnId,
						content,
						dateFormat,
						dateFormatSeparator
					);
					newCell = cell;
				} else if (type === CellType.CHECKBOX) {
					newCell = createCheckboxCell(columnId, {
						value: content.toLowerCase() === "true" ? true : false,
					});
				} else if (type === CellType.NUMBER) {
					newCell = createNumberCell(columnId, {
						value: parseFloat(content),
					});
				} else if (type === CellType.EMBED) {
					newCell = createEmbedCell(columnId, {
						pathOrUrl: content,
					});
				} else if (type === CellType.FILE) {
					newCell = createFileCell(columnId, {
						path: content,
					});
				} else if (type === CellType.CREATION_TIME) {
					newCell = createCreationTimeCell(columnId);
				} else if (type === CellType.LAST_EDITED_TIME) {
					newCell = createLastEditedTimeCell(columnId);
				} else if (type === CellType.SOURCE) {
					newCell = createSourceCell(columnId);
				} else if (type === CellType.SOURCE_FILE) {
					newCell = createSourceFileCell(columnId);
				} else if (type === CellType.TEXT) {
					newCell = createTextCell(columnId, {
						content,
					});
				} else {
					throw new Error("Unhandled cell type");
				}
				nextCells.push(newCell);
			});

			return {
				...newRow,
				cells: nextCells,
			};
		});

	const nextRows = [...updatedRows, ...newRows];

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: nextColumns,
			rows: nextRows,
		},
	};
};

const findMultiTagCell = (
	columnTags: Tag[],
	columnId: string,
	content: string
) => {
	const newTags: Tag[] = [];
	const tagIds: string[] = [];

	const parsedTags = content.split(",").map((tag) => tag.trim());
	if (parsedTags.length !== 0) {
		parsedTags.forEach((tag) => {
			const existingTag = columnTags.find((t) => {
				return t.content === tag;
			});
			if (existingTag) {
				tagIds.push(existingTag.id);
			} else {
				const newTag = createTag(tag);
				newTags.push(newTag);
				tagIds.push(newTag.id);
			}
		});
	}

	const cell = createMultiTagCell(columnId, {
		tagIds,
	});
	return {
		cell,
		newTags,
	};
};

const findTagCell = (columnTags: Tag[], columnId: string, content: string) => {
	const newTags: Tag[] = [];
	let tagId: string | null = null;

	const parsedTags = content.split(",").map((tag) => tag.trim());
	if (parsedTags.length !== 0) {
		parsedTags.forEach((tag) => {
			const existingTag = columnTags.find((t) => t.content === tag);
			if (existingTag) {
				if (tagId === null) {
					tagId = existingTag.id;
				}
			} else {
				const newTag = createTag(tag);
				newTags.push(newTag);
				if (tagId === null) {
					tagId = newTag.id;
				}
			}
		});
	}

	const cell = createTagCell(columnId, {
		tagId,
	});
	return {
		cell,
		newTags,
	};
};

const findDateCell = (
	columnId: string,
	content: string,
	dateFormat: DateFormat | null,
	dateFormatSeparator: DateFormatSeparator | null
) => {
	let dateTime = null;
	if (dateFormat && dateFormatSeparator) {
		if (isValidDateString(content, dateFormat, dateFormatSeparator)) {
			dateTime = dateStringToDateTime(
				content,
				dateFormat,
				dateFormatSeparator
			);
		}
	}
	const cell = createDateCell(columnId, {
		dateTime,
	});
	return cell;
};
