import { CellType } from "src/shared/table-state/types";

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
