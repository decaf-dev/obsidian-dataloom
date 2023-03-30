import { SortDir } from "../sort/types";

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	TAG = "tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	MULTI_TAG = "multi-tag",
}

export interface TableComponent {
	id: string;
	component: React.ReactNode;
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
}

export interface Row {
	id: string;
	creationDate: number;
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
