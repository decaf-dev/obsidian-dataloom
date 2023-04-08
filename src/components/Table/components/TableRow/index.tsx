import { RenderTableBodyRow, RenderTableFooterRow } from "../../types";
import TableCell from "./components/TableCell";

interface TableRowProps {
	row: RenderTableBodyRow | RenderTableFooterRow;
}

export const TableRow = ({ row }: TableRowProps) => {
	return (
		<tr id={row.id} className="NLT__tr">
			{row.cells.map((cell) => (
				<TableCell key={cell.id} content={cell.content} />
			))}
		</tr>
	);
};
