import { TableHeaderRow } from "./components/TableHeaderRow";
import { TableRow } from "./components/TableRow";
import "./styles.css";
import {
	RenderTableBodyRow,
	RenderTableFooterRow,
	RenderTableHeaderRow,
} from "./types";

interface Props {
	headerRows: RenderTableHeaderRow[];
	bodyRows: RenderTableBodyRow[];
	footerRows: RenderTableFooterRow[];
}

export default function Table({ headerRows, bodyRows, footerRows }: Props) {
	return (
		<table className="NLT__table">
			<thead className="NLT__thead">
				{headerRows.map((row) => (
					<TableHeaderRow key={row.id} row={row} />
				))}
			</thead>
			<tbody className="NLT__tbody">
				{bodyRows.map((row) => (
					<TableRow key={row.id} row={row} />
				))}
			</tbody>
			<tfoot className="NLT__tfoot">
				{footerRows.map((row) => (
					<TableRow key={row.id} row={row} />
				))}
			</tfoot>
		</table>
	);
}
