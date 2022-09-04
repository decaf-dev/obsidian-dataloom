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
	sortDir: SortDir; //render only
	sortName?: string; //Deprecated in 4.1.2 //render only
	width: string; //render only
	type: string;
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
	type: string;
	content: string;
	previousContent: string;
}

export interface Tag {
	id: string;
	headerId: string;
	content: string;
	color: string;
	selected: string[];
}
