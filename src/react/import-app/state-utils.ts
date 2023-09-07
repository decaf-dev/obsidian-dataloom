import {
	createBodyCell,
	createBodyRow,
	createColumn,
	createFooterCell,
	createHeaderCell,
} from "src/shared/loom-state/loom-state-factory";
import {
	BodyCell,
	Column,
	FooterCell,
	HeaderCell,
	LoomState,
} from "src/shared/loom-state/types";
import { ColumnMatch, ImportData } from "./types";
import { NEW_COLUMN_ID } from "./constants";

export const updateStateWithImportData = (
	prevState: LoomState,
	data: ImportData,
	columnMatches: ColumnMatch[]
): LoomState => {
	const {
		headerCells,
		headerRows,
		bodyRows,
		bodyCells,
		footerCells,
		footerRows,
		columns,
	} = prevState.model;

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

	//Create a header cell for each new column
	const newHeaderCells: HeaderCell[] = newColumns.map((column) =>
		createHeaderCell(column.id, headerRows[0].id)
	);
	const nextHeaderCells = [...headerCells, ...newHeaderCells];

	//Create a footer cell for each new column
	const newFooterCells: FooterCell[] = newColumns.map((column) =>
		createFooterCell(column.id, footerRows[0].id)
	);
	//TODO remove
	const newFooterCells2: FooterCell[] = newColumns.map((column) =>
		createFooterCell(column.id, footerRows[1].id)
	);
	const nextFooterCells = [
		...footerCells,
		...newFooterCells,
		...newFooterCells2,
	];

	const newBodyCells: BodyCell[] = [];
	newColumns.forEach((column) => {
		bodyRows.forEach((row) => {
			const cell = createBodyCell(column.id, row.id);
			newBodyCells.push(cell);
		});
	});

	//This represents the rows that we are importing
	dataRows.forEach((dataRow, j) => {
		const rowId = newBodyRows[j].id;

		//This represents the columns in the current data
		nextColumns.forEach((column) => {
			const { id: columnId } = column;
			const match = columnMatches.find(
				(match) => match.columnId === columnId
			);

			//For each row we create, we need to create a body cell. However,
			//only those cells that have a match will have a value
			let content = "";
			if (match) {
				const { importColumnIndex } = match;
				content = dataRow[importColumnIndex];
			}

			// const addedTags: string[] = [];

			// //TODO handle date
			// //TODO handle number
			// if (type === CellType.TAG || type === CellType.MULTI_TAG) {
			// 	const parsedTags = cellValue.split(",");
			// 	const tagsToAdd = parsedTags.map((tag) => createTag(tag));
			// 	addedTags.push(...tagsToAdd.map((tag) => tag.id));

			// 	if (!column) throw new ColumNotFoundError(columnId);
			// 	column.tags.push(...tagsToAdd);
			// }

			const cell = createBodyCell(columnId, rowId, {
				markdown: content,
				// tagIds: addedTags,
			});
			newBodyCells.push(cell);
		});
	});

	const nextBodyCells = [...bodyCells, ...newBodyCells];

	return {
		...prevState,
		model: {
			...prevState.model,
			columns: nextColumns,
			headerCells: nextHeaderCells,
			bodyRows: nextBodyRows,
			bodyCells: nextBodyCells,
			footerCells: nextFooterCells,
		},
	};
};
