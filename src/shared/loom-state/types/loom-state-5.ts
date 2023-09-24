/******* Type definitions for v6.8.0 *******/

/**
 * v6.8.0
 */
export interface LoomState5 {
	pluginVersion: string;
	model: TableModel;
}

type FunctionType = GeneralFunction | NumberFunction;

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

enum FilterType {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

enum DateFormat {
	MM_DD_YYYY = "mm/dd/yyyy",
	DD_MM_YYYY = "dd/mm/yyyy",
	YYYY_MM_DD = "yyyy/mm/dd",
	FULL = "full",
	RELATIVE = "relative",
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

enum GeneralFunction {
	NONE = "none",
	COUNT_ALL = "count_all",
	COUNT_VALUES = "count_values",
	COUNT_UNIQUE = "count_unique",
	COUNT_EMPTY = "count_empty",
	COUNT_NOT_EMPTY = "count_not_empty",
	PERCENT_EMPTY = "percent_empty",
	PERCENT_NOT_EMPTY = "percent_not_empty",
}

enum NumberFunction {
	SUM = "sum",
	AVG = "avg",
	MIN = "min",
	MAX = "max",
	MEDIAN = "median",
	RANGE = "range",
}

interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	shouldWrapOverflow: boolean;
}

interface FilterRule {
	id: string;
	columnId: string;
	type: FilterType;
	text: string;
	tagIds: string[];
	isEnabled: boolean;
}

interface Row {
	id: string;
}

interface BodyRow extends Row {
	index: number;
	menuCellId: string;
	creationTime: number;
	lastEditedTime: number;
}

type HeaderRow = Row;
type FooterRow = Row;

interface Cell {
	id: string;
	columnId: string;
	rowId: string;
}

interface HeaderCell extends Cell {
	markdown: string;
}

interface BodyCell extends Cell {
	dateTime: number | null;
	markdown: string;
}

interface FooterCell extends Cell {
	functionType: FunctionType;
}

interface Tag {
	id: string;
	markdown: string;
	color: Color;
	columnId: string;
	cellIds: string[];
}

interface TableModel {
	columns: Column[];
	headerRows: HeaderRow[];
	bodyRows: BodyRow[];
	footerRows: FooterRow[];
	headerCells: HeaderCell[];
	bodyCells: BodyCell[];
	footerCells: FooterCell[];
	tags: Tag[];
	filterRules: FilterRule[];
}
