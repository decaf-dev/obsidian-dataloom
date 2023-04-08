import { RenderTableHeaderRow } from "../../types";
import TableHeaderCell from "./components/TableHeaderCell";

interface TableHeaderRowProps {
	row: RenderTableHeaderRow;
}

export const TableHeaderRow = ({ row }: TableHeaderRowProps) => {
	return (
		<tr id={row.id} className="NLT__tr">
			{row.cells.map((cell) => (
				<TableHeaderCell
					key={cell.id}
					columnId={cell.columnId}
					content={cell.content}
				/>
			))}
		</tr>
	);
};
