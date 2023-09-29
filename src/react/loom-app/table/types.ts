export interface TableRow {
	cells: TableCell[];
}

export interface BodyTableRow extends TableRow {
	id: string;
}

export interface HeaderTableRow {
	cells: {
		columnId: string;
		content: React.ReactNode;
	}[];
}

export interface TableCell {
	id: string;
	content: React.ReactNode;
}
