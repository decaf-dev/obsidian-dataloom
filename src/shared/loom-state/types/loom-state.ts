/******* Type definitions for v8.6.0 *******/

/**
 * v8.6.0
 */
export interface LoomState {
	pluginVersion: string;
	model: TableModel;
}

export interface TableModel {
	columns: Column[];
	rows: Row[];
	filters: Filter[];
	settings: TableSettings;
}

export interface TableSettings {
	numFrozenColumns: number;
	showCalculationRow: boolean;
}

export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	content: string;
	numberFormat: NumberFormat;
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

export interface Row {
	id: string;
	index: number;
	creationTime: number;
	lastEditedTime: number;
	cells: Cell[];
}

export interface Cell {
	id: string;
	columnId: string;
	isExternalLink: boolean;
	dateTime: number | null;
	content: string;
	tagIds: string[];
}

export interface Tag {
	id: string;
	content: string;
	color: Color;
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

export enum NumberFormat {
	NUMBER = "number",
	CURRENCY = "currency",
}

export enum CurrencyType {
	ARGENTINA = "ARS",
	AUSTRALIA = "AUD",
	CANADA = "CAD",
	COLOMBIA = "COP",
	DENMARK = "DKK",
	UAE = "AED",
	EUROPE = "EUR",
	ICELAND = "ISK",
	ISRAEL = "ILS",
	MEXICO = "MXN",
	NORWAY = "NOK",
	GREAT_BRITAIN = "GBP",
	BRAZIL = "BRL",
	SAUDI_ARABIA = "SAR",
	RUSSIA = "RUB",
	INDIA = "INR",
	SINGAPORE = "SGB",
	SWEDEN = "SEK",
	SWITZERLAND = "CHF",
	UNITED_STATES = "USD",
	SOUTH_KOREA = "KRW",
	JAPAN = "JPY",
	CHINA = "CNY",
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
	IS_BEFORE = "is-before",
	IS_AFTER = "is-after",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

export enum DateFilterOption {
	UNSELECTED = "unselected",
	TODAY = "today",
	TOMORROW = "tomorrow",
	YESTERDAY = "yesterday",
	ONE_WEEK_AGO = "one-week-ago",
	ONE_WEEK_FROM_NOW = "one-week-from-now",
	ONE_MONTH_AGO = "one-month-ago",
	ONE_MONTH_FROM_NOW = "one-month-from-now",
}

export type FilterCondition =
	| TextFilterCondition
	| DateFilterCondition
	| NumberFilterCondition;

export interface BaseFilter {
	id: string;
	columnId: string;
	operator: FilterOperator;
	isEnabled: boolean;
}

/* Text filter */
export type TextCondition = TextFilterCondition;

export interface TextFilter extends BaseFilter {
	type: CellType.TEXT;
	condition: TextCondition;
	text: string;
}

/* File filter */
export type FileCondition = TextFilterCondition;

export interface FileFilter extends BaseFilter {
	type: CellType.FILE;
	condition: FileCondition;
	text: string;
}

/* Checkbox filter */
export type CheckboxCondition =
	| TextFilterCondition.IS
	| TextFilterCondition.IS_NOT;

export interface CheckboxFilter extends BaseFilter {
	type: CellType.CHECKBOX;
	condition: CheckboxCondition;
	text: string;
}

/* Tag filter */
export type TagCondition =
	| TextFilterCondition.IS
	| TextFilterCondition.IS_NOT
	| TextFilterCondition.IS_EMPTY
	| TextFilterCondition.IS_NOT_EMPTY;

export interface TagFilter extends BaseFilter {
	type: CellType.TAG;
	condition: TagCondition;
	tagId: string;
}

/* Multi-tag filter */
export type MultiTagCondition =
	| TextFilterCondition.CONTAINS
	| TextFilterCondition.DOES_NOT_CONTAIN
	| TextFilterCondition.IS_EMPTY
	| TextFilterCondition.IS_NOT_EMPTY;

export interface MultiTagFilter extends BaseFilter {
	type: CellType.MULTI_TAG;
	condition: MultiTagCondition;
	tagIds: string[];
}

/* Embed filter */
export type EmbedCondition =
	| TextFilterCondition.IS_EMPTY
	| TextFilterCondition.IS_NOT_EMPTY;

export interface EmbedFilter extends BaseFilter {
	type: CellType.EMBED;
	condition: EmbedCondition;
	text: string;
}

/* Number filter */
export type NumberCondition = NumberFilterCondition;

export interface NumberFilter extends BaseFilter {
	type: CellType.NUMBER;
	condition: NumberCondition;
	text: string;
}

/* Date filter */
export type DateCondition = DateFilterCondition;

export interface DateFilter extends BaseFilter {
	type: CellType.DATE;
	condition: DateCondition;
	option: DateFilterOption;
	dateTime: number | null;
}

/* Creation time filter  */
export type CreationTimeCondition =
	| DateFilterCondition.IS
	| DateFilterCondition.IS_AFTER
	| DateFilterCondition.IS_BEFORE;

export interface CreationTimeFilter extends BaseFilter {
	type: CellType.CREATION_TIME;
	condition: CreationTimeCondition;
	option: DateFilterOption;
	dateTime: number | null;
}

/* Last edited filter  */
export type LastEditedTimeCondition =
	| DateFilterCondition.IS
	| DateFilterCondition.IS_AFTER
	| DateFilterCondition.IS_BEFORE;

export interface LastEditedTimeFilter extends BaseFilter {
	type: CellType.LAST_EDITED_TIME;
	condition: LastEditedTimeCondition;
	option: DateFilterOption;
	dateTime: number | null;
}

export type Filter =
	| TextFilter
	| TagFilter
	| MultiTagFilter
	| CheckboxFilter
	| FileFilter
	| EmbedFilter
	| NumberFilter
	| DateFilter
	| CreationTimeFilter
	| LastEditedTimeFilter;
