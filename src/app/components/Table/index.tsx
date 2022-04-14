import React from "react";

import { TableHeader, TableRow } from "src/app/services/state";
import "./styles.css";

interface Props {
	headers: TableHeader[];
	rows: TableRow[];
	onAddColumn: () => void;
	onAddRow: () => void;
}

export default function Table({ headers, rows, onAddColumn, onAddRow }: Props) {
	return (
		<table>
			<thead>
				<tr>
					{headers.map((header) => (
						<React.Fragment key={header.id}>
							{header.component}
						</React.Fragment>
					))}
					<th className="NLT__th">
						<button
							className="NLT__button NLT__button--sm"
							onClick={() => onAddColumn()}
						>
							New
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.id}>{row.component}</tr>
				))}
			</tbody>
			<tfoot>
				<tr>
					<td className="NLT__td">
						<button
							className="NLT__button NLT__button--sm"
							onClick={() => onAddRow()}
						>
							New
						</button>
					</td>
					{headers.map((header) => (
						<td key={header.id} className="NLT__td"></td>
					))}
				</tr>
			</tfoot>
		</table>
	);
}
