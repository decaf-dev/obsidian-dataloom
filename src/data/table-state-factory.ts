import { randomColor } from "src/shared/colors";
import { CURRENT_PLUGIN_VERSION } from "./constants";
import {
	BodyCell,
	BodyRow,
	CellType,
	Column,
	CurrencyType,
	DateFormat,
	FilterRule,
	FilterType,
	FooterCell,
	FooterRow,
	GeneralFunction,
	HeaderCell,
	HeaderRow,
	SortDir,
	TableState,
	Tag,
} from "../shared/table-state/types";

import { v4 as uuidv4 } from "uuid";
import { CHECKBOX_MARKDOWN_UNCHECKED } from "src/shared/table-state/constants";

export const createColumn = (id = uuidv4()): Column => {
	return {
		id,
		sortDir: SortDir.NONE,
		isVisible: true,
		width: "140px",
		type: CellType.TEXT,
		currencyType: CurrencyType.UNITED_STATES,
		dateFormat: DateFormat.MM_DD_YYYY,
		shouldWrapOverflow: false,
	};
};

export const createHeaderRow = (): HeaderRow => {
	return {
		id: uuidv4(),
	};
};

export const createFooterRow = (): FooterRow => {
	return {
		id: uuidv4(),
	};
};

export const createBodyRow = (index: number, id = uuidv4()): BodyRow => {
	const currentTime = Date.now();
	return {
		id,
		index,
		menuCellId: uuidv4(),
		creationTime: currentTime,
		lastEditedTime: currentTime,
	};
};

export const createHeaderCell = (
	columnId: string,
	rowId: string,
	options: { id?: string } = {}
): HeaderCell => {
	const { id = uuidv4() } = options || {};
	return {
		id,
		columnId,
		rowId,
		markdown: "New Column",
	};
};

export const createBodyCell = (
	columnId: string,
	rowId: string,
	options: { cellType?: CellType; id?: string } = {}
): BodyCell => {
	const { id = uuidv4(), cellType } = options || {};
	return {
		id,
		columnId,
		rowId,
		dateTime: null,
		markdown:
			cellType === CellType.CHECKBOX ? CHECKBOX_MARKDOWN_UNCHECKED : "",
	};
};

export const createFilterRule = (columnId: string): FilterRule => {
	return {
		id: uuidv4(),
		columnId,
		type: FilterType.IS,
		text: "",
		tagIds: [],
		isEnabled: true,
	};
};

export const createFooterCell = (
	columnId: string,
	rowId: string,
	options: { id?: string } = {}
): FooterCell => {
	const { id = uuidv4() } = options || {};
	return {
		id,
		columnId,
		rowId,
		functionType: GeneralFunction.NONE,
	};
};

export const createTag = (
	columnId: string,
	cellId: string,
	markdown: string,
	color = randomColor()
): Tag => {
	return {
		id: uuidv4(),
		columnId,
		markdown: markdown,
		color,
		cellIds: [cellId],
	};
};

export const createTableState = (
	numColumns: number,
	numRows: number
): TableState => {
	//Create columns
	const columns: Column[] = [];
	for (let i = 0; i < numColumns; i++) columns.push(createColumn());

	//Create headers
	const headerRows: HeaderRow[] = [];
	headerRows.push(createHeaderRow());

	const headerCells: HeaderCell[] = [];

	for (let x = 0; x < numColumns; x++) {
		headerCells.push(createHeaderCell(columns[x].id, headerRows[0].id));
	}

	//Create body
	const bodyRows: BodyRow[] = [];
	for (let i = 0; i < numRows; i++) bodyRows.push(createBodyRow(i));

	const bodyCells: BodyCell[] = [];
	for (let y = 0; y < numRows; y++) {
		for (let x = 0; x < numColumns; x++) {
			bodyCells.push(createBodyCell(columns[x].id, bodyRows[y].id));
		}
	}

	//Create footers
	const footerRows: FooterRow[] = [];
	footerRows.push(createFooterRow());
	footerRows.push(createFooterRow());

	const footerCells: FooterCell[] = [];

	for (let y = 0; y < 2; y++) {
		for (let x = 0; x < numColumns; x++) {
			footerCells.push(createFooterCell(columns[x].id, footerRows[y].id));
		}
	}

	const tags: Tag[] = [];
	const filterRules: FilterRule[] = [];

	return {
		model: {
			columns,
			headerRows,
			bodyRows,
			footerRows,
			headerCells,
			bodyCells,
			footerCells,
			tags,
			filterRules,
		},
		pluginVersion: CURRENT_PLUGIN_VERSION,
	};
};
