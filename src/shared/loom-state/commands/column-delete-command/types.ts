import type { Cell, Column, Filter } from "../../types/loom-state";

export interface DeletedColumn {
	arrIndex: number;
	column: Column;
}

export interface DeletedCell {
	rowId: string;
	arrIndex: number;
	cell: Cell;
}

export interface DeletedFilter {
	arrIndex: number;
	filter: Filter;
}
