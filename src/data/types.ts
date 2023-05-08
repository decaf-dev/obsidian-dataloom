import { Color } from "../shared/types";

export enum SortDir {
	ASC = "asc",
	DESC = "desc",
	NONE = "default",
}

export enum CellType {
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

export enum FilterType {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
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

export enum GeneralFunction {
	NONE = "none",
	COUNT_ALL = "count_all",
	COUNT_VALUES = "count_values",
	COUNT_UNIQUE = "count_unique",
	COUNT_EMPTY = "count_empty",
	COUNT_NOT_EMPTY = "count_not_empty",
	PERCENT_EMPTY = "percent_empty",
	PERCENT_NOT_EMPTY = "percent_not_empty",
}

export enum NumberFunction {
	SUM = "sum",
	AVG = "avg",
	MIN = "min",
	MAX = "max",
	MEDIAN = "median",
	RANGE = "range",
}

export type FunctionType = GeneralFunction | NumberFunction;

export interface Column633 {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	shouldWrapOverflow: boolean;
	footerCellId: string;
}

export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	currencyType: CurrencyType;
	shouldWrapOverflow: boolean;
}

export interface Row633 {
	id: string;
	index: number;
	menuCellId: string;
	creationTime: number;
	lastEditedTime: number;
}

export interface FilterRule {
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

export interface BodyRow extends Row {
	index: number;
	menuCellId: string;
	creationTime: number;
	lastEditedTime: number;
}

export type HeaderRow = Row;
export type FooterRow = Row;

interface Cell {
	id: string;
	columnId: string;
	rowId: string;
}

export interface HeaderCell extends Cell {
	markdown: string;
}

export interface BodyCell extends Cell {
	dateTime: number | null;
	markdown: string;
}

export interface FooterCell extends Cell {
	functionType: FunctionType;
}

export interface Cell633 {
	id: string;
	columnId: string;
	dateTime: number | null;
	rowId: string;
	markdown: string;
	isHeader: boolean;
}

export interface Tag {
	id: string;
	markdown: string;
	color: Color;
	columnId: string;
	cellIds: string[];
}

export interface TableModel633 {
	columns: Column633[];
	rows: Row633[];
	cells: Cell633[];
	tags: Tag[];
}

export interface TableModel {
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

export interface TableModel670 {
	columns: Column[];
	headerRows: HeaderRow[];
	bodyRows: BodyRow[];
	footerRows: FooterRow[];
	headerCells: HeaderCell[];
	bodyCells: BodyCell[];
	footerCells: FooterCell[];
	tags: Tag[];
}
export interface BaseTableState {
	pluginVersion: number;
}
export interface TableState extends BaseTableState {
	model: TableModel;
}

export interface TableState670 extends BaseTableState {
	model: TableModel670;
}

export interface TableState633 extends BaseTableState {
	model: TableModel633;
}
