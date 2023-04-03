import { SortDir } from "../sort/types";

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	TAG = "tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	MULTI_TAG = "multi-tag",
	CREATION_TIME = "creation-time",
	LAST_EDITED_TIME = "last-edited-time",
}
export interface Cell {
	id: string;
	columnId: string;
	rowId: string;
	markdown: string;
	isHeader: boolean;
}

export interface TagCellReference {
	rowId: string;
	columnId: string;
}

export interface Tag {
	id: string;
	markdown: string;
	color: string;
	cells: string[];
}
export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
	tags: Tag[];
	footerCellId: string;
}

export interface Row {
	id: string;
	menuCellId: string;
	creationTime: number;
	lastEditedTime: number;
}

export interface TableModel {
	columns: Column[];
	rows: Row[];
	cells: Cell[];
}

export interface TableState {
	model: TableModel;
	pluginVersion: number;
}
