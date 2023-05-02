import { TableHeaderRow } from "./components/TableHeaderRow";
import { TableBodyRow } from "./components/TableBodyRow";
import "./styles.css";
import {
	RenderTableBodyRow,
	RenderTableFooterRow,
	RenderTableHeaderRow,
} from "./types";
import { TableFooterRow } from "./components/TableFooterRow";

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
					<TableBodyRow key={row.id} row={row} />
				))}
			</tbody>
			<tfoot className="NLT__tfoot">
				{footerRows.map((row) => (
					<TableFooterRow key={row.id} row={row} />
				))}
			</tfoot>
		</table>
	);
}
