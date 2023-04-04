export interface TableRenderRow {
	id: string;
	cells: TableRenderCell[];
}

export interface TableRenderCell {
	id: string;
	content: React.ReactNode;
}
