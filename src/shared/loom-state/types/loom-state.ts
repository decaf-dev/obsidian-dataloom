/**
 * Type definitions for v8.5.0
 */
export interface LoomState {
	pluginVersion: string;
	model: TableModel;
}

export enum Color {
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

export enum PaddingSize {
	UNSET = "unset",
	SM = "sm",
	MD = "md",
	LG = "lg",
	XL = "xl",
	XXL = "2xl",
	XXXL = "3xl",
	XXXXL = "4xl",
}

export enum SortDir {
	ASC = "asc",
	DESC = "desc",
	NONE = "default",
}

export enum CellType {
	TEXT = "text",
	EMBED = "embed",
	FILE = "file",
	NUMBER = "number",
	CURRENCY = "currency",
	TAG = "tag",
	MULTI_TAG = "multi-tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	CREATION_TIME = "creation-time",
	LAST_EDITED_TIME = "last-edited-time",
}

export enum DateFormat {
	MM_DD_YYYY = "mm/dd/yyyy",
	DD_MM_YYYY = "dd/mm/yyyy",
	YYYY_MM_DD = "yyyy/mm/dd",
	FULL = "full",
	RELATIVE = "relative",
}

export enum CurrencyType {
	UNITED_STATES = "USD",
	CANADA = "CAD",
	SINGAPORE = "SGB",
	EUROPE = "EUR",
	SWEDEN = "SEK",
	DENMARK = "DKK",
	NORWAY = "NOK",
	ICELAND = "ISK",
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
	ISRAEL = "ILS",
	SWITZERLAND = "CHF",
}

export enum AspectRatio {
	UNSET = "unset",
	NINE_BY_SIXTEEN = "9/16",
	FOUR_BY_THREE = "4/3",
	SIXTEEN_BY_NINE = "16/9",
}

/********** CALCULATIONS **********/
export enum GeneralCalculation {
	NONE = "none",
	COUNT_ALL = "count-all",
	COUNT_VALUES = "count-values",
	COUNT_UNIQUE = "count-unique",
	COUNT_EMPTY = "count-empty",
	COUNT_NOT_EMPTY = "count-not-empty",
	PERCENT_EMPTY = "percent-empty",
	PERCENT_NOT_EMPTY = "percent-not-empty",
}

export enum NumberCalculation {
	SUM = "sum",
	AVG = "avg",
	MIN = "min",
	MAX = "max",
	MEDIAN = "median",
	RANGE = "range",
}

export type CalculationType = GeneralCalculation | NumberCalculation;

/************* FILTERS ****************/
export type FilterOperator = "and" | "or";

export enum TextFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

export enum NumberFilterCondition {
	IS_EQUAL = "is-equal",
	IS_NOT_EQUAL = "is-not-equal",
	IS_GREATER = "is-greater",
	IS_LESS = "is-less",
	IS_GREATER_OR_EQUAL = "is-greater-or-equal",
	IS_LESS_OR_EQUAL = "is-less-or-equal",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

//TODO add support for more date types
export enum DateFilterCondition {
	IS = "is",
	BEFORE = "before",
	AFTER = "after",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

export type FilterCondition =
	| TextFilterCondition
	| DateFilterCondition
	| NumberFilterCondition;

interface BaseFilter {
	id: string;
	type: CellType;
	columnId: string;
	operator: FilterOperator;
	isEnabled: boolean;
}

export interface TextFilter extends BaseFilter {
	condition: FilterCondition;
	text: string;
}

export interface FileFilter extends TextFilter {
	condition: FilterCondition;
	text: string;
}

export interface CheckboxFilter extends BaseFilter {
	condition: TextFilterCondition.IS | TextFilterCondition.IS_NOT;
	text: string;
}

export interface TagFilter extends BaseFilter {
	condition:
		| TextFilterCondition.IS
		| TextFilterCondition.IS_NOT
		| TextFilterCondition.IS_EMPTY
		| TextFilterCondition.IS_NOT_EMPTY;
	tagId: string;
}

export interface MultiTagFilter extends BaseFilter {
	condition:
		| TextFilterCondition.CONTAINS
		| TextFilterCondition.DOES_NOT_CONTAIN
		| TextFilterCondition.IS_EMPTY
		| TextFilterCondition.IS_NOT_EMPTY;
	tagIds: string[];
}

export type Filter =
	| TextFilter
	| TagFilter
	| MultiTagFilter
	| CheckboxFilter
	| FileFilter;

/************ TABLE TYPES ***************/

export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	shouldWrapOverflow: boolean;
	tags: Tag[];
	calculationType: CalculationType;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
}

interface Row {
	id: string;
}

export interface BodyRow extends Row {
	index: number;
	creationTime: number;
	lastEditedTime: number;
}

export type HeaderRow = Row;
export type FooterRow = Row;

export interface Cell {
	id: string;
	columnId: string;
	rowId: string;
}

export interface HeaderCell extends Cell {
	markdown: string;
}

export interface BodyCell extends Cell {
	isExternalLink: boolean;
	dateTime: number | null;
	markdown: string;
	tagIds: string[];
}

export type FooterCell = Cell;

export interface Tag {
	id: string;
	markdown: string;
	color: Color;
}

export interface TableSettings {
	numFrozenColumns: number;
}

export interface TableModel {
	columns: Column[];
	headerRows: HeaderRow[];
	bodyRows: BodyRow[];
	footerRows: FooterRow[];
	headerCells: HeaderCell[];
	bodyCells: BodyCell[];
	footerCells: FooterCell[];
	filters: Filter[];
	settings: TableSettings;
}
