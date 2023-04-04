import React from "react";

import "./styles.css";
import { TableRenderRow } from "./types";

interface Props {
	headers: TableRenderRow[];
	rows: TableRenderRow[];
	footers: TableRenderRow[];
}

interface TableRowProps {
	row: TableRenderRow;
	isHeader?: boolean;
}

export const TableRow = ({ row, isHeader = false }: TableRowProps) => {
	return (
		<tr className="NLT__tr">
			{row.cells.map((cell) => (
				<TableCell
					key={cell.id}
					content={cell.content}
					isHeader={isHeader}
				/>
			))}
		</tr>
	);
};

interface TableCellProps {
	content: React.ReactNode;
	isHeader: boolean;
}

export const TableCell = ({ content, isHeader }: TableCellProps) => {
	if (isHeader) {
		return <th className="NLT__th">{content}</th>;
	}
	return <td className="NLT__td">{content}</td>;
};

export default function Table({ headers, rows, footers }: Props) {
	return (
		<table className="NLT__table">
			<thead className="NLT__thead">
				{headers.map((header) => (
					<TableRow key={header.id} row={header} isHeader />
				))}
			</thead>
			<tbody className="NLT__tbody">
				{rows.map((row) => (
					<TableRow key={row.id} row={row} />
				))}
			</tbody>
			<tfoot className="NLT__tfoot">
				{footers.map((footer) => (
					<TableRow key={footer.id} row={footer} />
				))}
			</tfoot>
		</table>
	);
}
