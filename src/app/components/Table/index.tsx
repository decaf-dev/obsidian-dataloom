import React, { forwardRef } from "react";

import { TableHeader } from "src/app/services/appData/state/header";
import { TableRow } from "src/app/services/appData/state/row";
import Button from "../Button";
import "./styles.css";

interface Props {
	headers: TableHeader[];
	rows: TableRow[];
	onAddColumn: () => void;
	onAddRow: () => void;
}

const Table = forwardRef(
	({ headers, rows, onAddColumn, onAddRow }: Props, ref) => {
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
							<Button onClick={() => onAddColumn()}>New</Button>
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
							<Button onClick={() => onAddRow()}>New</Button>
						</td>
						{headers.map((header) => (
							<td key={header.id} className="NLT__td"></td>
						))}
					</tr>
				</tfoot>
			</table>
		);
	}
);

export default Table;
