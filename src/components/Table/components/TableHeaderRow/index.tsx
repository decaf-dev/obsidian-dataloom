import { RenderTableHeaderRow } from "../../types";
import TableHeaderCell from "./components/TableHeaderCell";

interface TableHeaderRowProps {
	row: RenderTableHeaderRow;
}

export const TableHeaderRow = ({ row }: TableHeaderRowProps) => {
	return (
		<tr id={row.id} className="NLT__tr">
			{row.cells.map((cell, i) => (
				<TableHeaderCell
					key={cell.id}
					columnId={cell.columnId}
					content={cell.content}
					isDraggable={i < row.cells.length - 1}
				/>
			))}
		</tr>
	);
};
