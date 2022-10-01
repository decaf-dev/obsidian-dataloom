import React from "react";

import { TableComponent } from "src/services/table/types";

import "./styles.css";

interface Props {
	headers: TableComponent[];
	rows: TableComponent[];
	footers: TableComponent[];
}

export default function Table({ headers, rows, footers }: Props) {
	return (
		<table className="NLT__table">
			<thead className="NLT__thead">
				<tr className="NLT__tr">
					{headers.map((header) => (
						<React.Fragment key={header.id}>
							{header.component}
						</React.Fragment>
					))}
				</tr>
			</thead>
			<tbody className="NLT__tbody">
				{rows.map((row) => (
					<tr key={row.id} className="NLT__tr">
						{row.component}
					</tr>
				))}
			</tbody>
			<tfoot className="NLT__tfoot">
				<tr className="NLT__tr">
					{footers.map((footer) => (
						<React.Fragment key={footer.id}>
							{footer.component}
						</React.Fragment>
					))}
				</tr>
			</tfoot>
		</table>
	);
}
