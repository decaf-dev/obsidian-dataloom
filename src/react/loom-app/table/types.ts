export interface TableRow {
	id: string;
	cells: TableCell[];
}

export interface TableCell {
	id: string;
	content: React.ReactNode;
}
