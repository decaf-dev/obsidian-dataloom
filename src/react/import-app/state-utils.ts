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

	//Add a cell for each new column to each row
	rows.forEach((row) => {
		const { cells } = row;
		const newCells = [...cells];
		newColumns.forEach((column) => {
			const cell = createCell(column.id);
			newCells.push(cell);
		});
		row.cells = newCells;
	});

	//Create a new row for each import data entry
	let newRows: Row[] = Array(importRows.length)
		.fill(null)
		.map((_val, i) => createRow(rows.length + i));

	//This represents the rows that we are importing
	newRows = newRows.map((row, i) => {
		const importRow = importRows[i];

		const nextCells: Cell[] = [];
		//This represents the columns in the current data
		nextColumns.forEach((column) => {
			const { id: columnId, type } = column;
			const match = columnMatches.find(
				(match) => match.columnId === columnId
			);

			//For each row we create, we need to create a body cell. However,
			//only those cells that have a match will have a value
			let content = "";
			let newCell: Cell | null = null;
			if (match) {
				const { importColumnIndex } = match;
				content = importRow[importColumnIndex];

				if (type === CellType.TAG || type === CellType.MULTI_TAG) {
					const { cell, newTags } = createTagCell(columnId, content);
					newCell = cell;
					column.tags.push(...newTags);
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
			...row,
			cells: nextCells,
		};
	});

	const nextRows = [...rows, ...newRows];

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: nextColumns,
			rows: nextRows,
		},
	};
};

const createTagCell = (columnId: string, content: string) => {
	const parsedTags = content.split(",");
	const newTags = parsedTags.map((tag) => createTag(tag));
	const newTagIds = newTags.map((tag) => tag.id);

	const cell = createCell(columnId, {
		content,
		tagIds: newTagIds,
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
