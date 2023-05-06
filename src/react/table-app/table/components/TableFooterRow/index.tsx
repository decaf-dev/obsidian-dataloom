import { RenderTableFooterRow } from "../../types";
import TableCell from "../TableCell";

interface TableRowProps {
	row: RenderTableFooterRow;
}

export const TableFooterRow = ({ row }: TableRowProps) => {
	return (
		<tr id={row.id} className="NLT__tr">
			{row.cells.map((cell) => (
				<TableCell key={cell.id} content={cell.content} />
			))}
		</tr>
	);
};
