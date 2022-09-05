import { SortDir } from "../../sort/types";
export interface AppData {
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}

export interface Header {
	id: string;
	content: string;
	textContent: string; //Added in 4.3.2
	sortDir: SortDir;
	width: string;
	type: CellType;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export interface Row {
	id: string;
	creationTime: number;
}

export interface Cell {
	id: string;
	rowId: string;
	headerId: string;
	type: CellType;
	content: string;
	textContent: string; //Added in 4.3.2
}

export interface Tag {
	id: string;
	headerId: string;
	content: string;
	color: string;
	selected: string[];
}

export enum CellType {
	TEXT = "text",
	NUMBER = "number",
	TAG = "tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	MULTI_TAG = "multi-tag",
}
