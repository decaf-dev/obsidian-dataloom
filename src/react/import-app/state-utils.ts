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
} from "src/shared/loom-state/types/loom-state";
import { ColumnMatch, ImportData } from "./types";
import { NEW_COLUMN_ID } from "./constants";

export const updateStateWithImportData = (
	prevState: LoomState,
	data: ImportData,
	columnMatches: ColumnMatch[]
): LoomState => {
	const { rows, bodyCells, columns } = prevState.model;

	//The first index is the header row
	//We want only the data rows
	const dataRows = data.slice(1);

	//Create a row for each data entry
	const newRows = Array(dataRows.length)
		.fill(null)
		.map((_val, i) => createRow(rows.length + i));
	const nextRows = [...rows, ...newRows];

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

	const newCells: Cell[] = [];
	newColumns.forEach((column) => {
		rows.forEach((row) => {
			const cell = createCell(column.id, row.id);
			newCells.push(cell);
		});
	});

	//This represents the rows that we are importing
	dataRows.forEach((dataRow, j) => {
		const newRow = newRows[j];
		const { id: rowId } = newRow;

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
				content = dataRow[importColumnIndex];

				if (type === CellType.TAG || type === CellType.MULTI_TAG) {
					const { cell, newTags } = createTagCell(
						columnId,
						rowId,
						content
					);
					newCell = cell;
					column.tags.push(...newTags);
				} else if (type === CellType.DATE) {
					const cell = createDateCell(columnId, rowId, content);
					newCell = cell;
				}
			}
			if (!newCell) {
				newCell = createCell(columnId, rowId, {
					markdown: content,
				});
			}
			newCells.push(newCell);
		});
	});

	const nextCells = [...bodyCells, ...newCells];

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: nextColumns,
			rows: nextRows,
			bodyCells: nextCells,
		},
	};
};

const createTagCell = (columnId: string, rowId: string, content: string) => {
	const parsedTags = content.split(",");
	const newTags = parsedTags.map((tag) => createTag(tag));
	const newTagIds = newTags.map((tag) => tag.id);

	const cell = createCell(columnId, rowId, {
		markdown: content,
		tagIds: newTagIds,
	});
	return {
		cell,
		newTags,
	};
};

const createDateCell = (columnId: string, rowId: string, content: string) => {
	const dateTime = getDateTimeFromContent(content);
	const cell = createCell(columnId, rowId, {
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
