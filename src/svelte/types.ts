export interface NewLoomState {
	pluginVersion: string;
	model: TableModel;
}

export interface TableModel {
	columns: Column[];
	rows: Row[];
}

export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	content: string;
	calculationType: CalculationType;
}

export interface Row {
	id: string;
	index: number;
	creationDateTime: string;
	lastEditedDateTime: string;
	cells: Cell[];
}

export interface Cell {
	id: string;
	columnId: string;
	content: string;
}

export enum SortDir {
	ASC = "asc",
	DESC = "desc",
	NONE = "default",
}

export enum CellType {
	TEXT = "text",
}

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
