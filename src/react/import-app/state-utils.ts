import {
	createBodyCell,
	createBodyRow,
	createColumn,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import {
	BodyCell,
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
	const { bodyRows, bodyCells, columns } = prevState.model;

	//The first index is the header row
	//We want only the data rows
	const dataRows = data.slice(1);

	//Create a row for each data entry
	const newBodyRows = Array(dataRows.length)
		.fill(null)
		.map((_val, i) => createBodyRow(bodyRows.length + i));
	const nextBodyRows = [...bodyRows, ...newBodyRows];

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

	const newBodyCells: BodyCell[] = [];
	newColumns.forEach((column) => {
		bodyRows.forEach((row) => {
			const cell = createBodyCell(column.id, row.id);
			newBodyCells.push(cell);
		});
	});

	//This represents the rows that we are importing
	dataRows.forEach((dataRow, j) => {
		const newBodyRow = newBodyRows[j];
		const { id: rowId } = newBodyRow;

		//This represents the columns in the current data
		nextColumns.forEach((column) => {
			const { id: columnId, type } = column;
			const match = columnMatches.find(
				(match) => match.columnId === columnId
			);

			//For each row we create, we need to create a body cell. However,
			//only those cells that have a match will have a value
			let content = "";
			let newCell: BodyCell | null = null;
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
				newCell = createBodyCell(columnId, rowId, {
					markdown: content,
				});
			}
			newBodyCells.push(newCell);
		});
	});

	const nextBodyCells = [...bodyCells, ...newBodyCells];

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: nextColumns,
			bodyRows: nextBodyRows,
			bodyCells: nextBodyCells,
		},
	};
};

const createTagCell = (columnId: string, rowId: string, content: string) => {
	const parsedTags = content.split(",");
	const newTags = parsedTags.map((tag) => createTag(tag));
	const newTagIds = newTags.map((tag) => tag.id);

	const cell = createBodyCell(columnId, rowId, {
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
	const cell = createBodyCell(columnId, rowId, {
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
