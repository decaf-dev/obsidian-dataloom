import { CellType } from "src/data/types";

export type ColumnFilter = {
	id: string;
	name: string;
	cellType: CellType;
};

export type ColumnToggle = {
	id: string;
	name: string;
	isVisible: boolean;
};
