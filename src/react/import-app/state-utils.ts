import {
	createCell,
	createRow,
	createColumn,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import {
	Cell,
	CellType,
	Column,
	LoomState,
	Row,
	Tag,
} from "src/shared/loom-state/types/loom-state";
import { ColumnMatch, ImportData } from "./types";
import { NEW_COLUMN_ID } from "./constants";

export const addImportData = (
	prevState: LoomState,
	data: ImportData,
	columnMatches: ColumnMatch[]
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
			const cell = createCell(column.id);
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
					content = importRow[importColumnIndex].trim();

					if (type === CellType.TAG) {
						const { cell, newTags } = createTagCell(
							columnTags,
							columnId,
							content
						);
						newCell = cell;
						columnTags.push(...newTags);
					} else if (type === CellType.MULTI_TAG) {
						const { cell, newTags } = createMultiTagCell(
							columnTags,
							columnId,
							content
						);
						newCell = cell;
						columnTags.push(...newTags);
					} else if (type === CellType.DATE) {
						const cell = createDateCell(columnId, content);
						newCell = cell;
					}
				}
				if (!newCell) {
					newCell = createCell(columnId, {
						content,
					});
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

const createMultiTagCell = (
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
				if (columnTags.length === 6) {
					console.log({
						content: t.content,
						tag,
						eq: t.content === tag,
					});
				}
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

	const cell = createCell(columnId, {
		tagIds,
	});
	console.log({
		cell,
		newTags,
	});
	return {
		cell,
		newTags,
	};
};

const createTagCell = (
	columnTags: Tag[],
	columnId: string,
	content: string
) => {
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

	const cell = createCell(columnId, {
		tagIds: tagId ? [tagId] : undefined,
	});
	return {
		cell,
		newTags,
	};
};

const createDateCell = (columnId: string, content: string) => {
	const dateTime = getDateTimeFromContent(content);
	const cell = createCell(columnId, {
		dateTime,
	});
	return cell;
};

const getDateTimeFromContent = (content: string): number | null => {
	const shouldParseAsNumber = isNumber(content);
	if (shouldParseAsNumber) return Number(content);
	if (!isDateParsable(content)) return null;

	const date = new Date(content);
	return date.getTime();
};

const isNumber = (value: string) => {
	return !isNaN(Number(value));
};

const isDateParsable = (value: string) => {
	try {
		const date = new Date(value);
		return !isNaN(date.getTime());
	} catch (e) {
		return false;
	}
};
