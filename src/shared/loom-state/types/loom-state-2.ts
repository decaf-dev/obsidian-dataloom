/******* Type definitions for v6.2.0 *******/

/**
 * v6.2.0
 */
export interface LoomState2 {
	pluginVersion: string;
	model: TableModel;
}

export enum DateFormat {
	MM_DD_YYYY = "mm/dd/yyyy",
	DD_MM_YYYY = "dd/mm/yyyy",
	YYYY_MM_DD = "yyyy/mm/dd",
	FULL = "full",
	RELATIVE = "relative",
}

export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	hasAutoWidth: boolean;
	shouldWrapOverflow: boolean;
	footerCellId: string;
}

enum Color {
	LIGHT_GRAY = "light gray",
	GRAY = "gray",
	BROWN = "brown",
	ORANGE = "orange",
	YELLOW = "yellow",
	GREEN = "green",
	BLUE = "blue",
	PURPLE = "purple",
	PINK = "pink",
	RED = "red",
}

enum SortDir {
	ASC = "asc",
	DESC = "desc",
	NONE = "default",
}

enum CellType {
	TEXT = "text",
	NUMBER = "number",
	CURRENCY = "currency",
	TAG = "tag",
	MULTI_TAG = "multi-tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	CREATION_TIME = "creation-time",
	LAST_EDITED_TIME = "last-edited-time",
}

enum CurrencyType {
	UNITED_STATES = "USD",
	CANADA = "CAD",
	SINGAPORE = "SGB",
	EUROPE = "EUR",
	POUND = "GBP",
	RUSSIA = "RUB",
	AUSTRALIA = "AUD",
	JAPAN = "JPY",
	INDIA = "INR",
	CHINA = "CNY",
	BRAZIL = "BRL",
	COLOMBIA = "COP",
	MEXICO = "MXN",
	ARGENTINA = "ARS",
}

interface Cell {
	id: string;
	columnId: string;
	rowId: string;
	markdown: string;
	isHeader: boolean;
}

interface Tag {
	id: string;
	markdown: string;
	color: Color;
	columnId: string;
	cellIds: string[];
}

interface Row {
	id: string;
	menuCellId: string;
	creationTime: number;
	lastEditedTime: number;
}

interface TableModel {
	columns: Column[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}
