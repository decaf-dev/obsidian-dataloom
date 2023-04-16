export interface RenderTableRow {
	id: string;
}

export interface RenderTableHeaderRow extends RenderTableRow {
	id: string;
	cells: RenderTableHeaderCell[];
}

export interface RenderTableBodyRow extends RenderTableRow {
	id: string;
	cells: RenderTableCell[];
}

export interface RenderTableFooterRow extends RenderTableRow {
	id: string;
	cells: RenderTableCell[];
}

export interface RenderTableCell {
	id: string;
	content: React.ReactNode;
}

export interface RenderTableHeaderCell extends RenderTableCell {
	columnId: string;
}

export interface TableDataTransferItem {
	type: "row" | "column";
	id: string;
}
