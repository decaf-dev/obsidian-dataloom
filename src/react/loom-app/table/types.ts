export interface TableRow {
	id: string;
	cells: TableCell[];
}

export interface HeaderTableRow {
	id: string;
	cells: HeaderTableCell[];
}

export interface TableCell {
	id: string;
	content: React.ReactNode;
}

export interface HeaderTableCell extends TableCell {
	columnId: string;
}
