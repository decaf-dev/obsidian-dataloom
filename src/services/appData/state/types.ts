import { SortDir } from "../../sort/types";

/**
 * Represents the table markdown model. It can be converted to markdown.
 */
export interface TableModel {
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}

export interface Header {
	id: string;
	content: string;
	sortDir: SortDir;
	sortName?: string; //Deprecated in 4.1.2
	width: string;
	type: string;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export interface Row {
	id: string;
	initialIndex: number;
	creationTime: number;
}

export interface Cell {
	id: string;
	rowId: string;
	headerId: string;
	type: string;
	toString: () => string;
	length: () => number;
}

export interface Tag {
	id: string;
	headerId: string;
	content: string;
	color: string;
	selected: string[];
}

/**
 * This represent a state that is able to saved in the settings cache
 */
export interface TableSettings {
	columns: ColumnSettings[];
	tag: TagSettings[];
}

export interface ColumnSettings {}

export interface TagSettings {}
