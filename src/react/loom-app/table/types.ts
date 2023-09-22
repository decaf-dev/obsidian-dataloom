export interface TableRow {
	cells: TableCell[];
}

export interface BodyTableRow extends TableRow {
	id: string;
}

export interface HeaderTableRow {
	cells: HeaderTableCell[];
}

export interface TableCell {
	id: string;
	content: React.ReactNode;
}

export interface HeaderTableCell extends TableCell {
	columnId: string;
}
