import React from "react";

export default function Table({
	headers = [],
	rows = [],
	onAddColumn = null,
	onAddRow = null,
}) {
	return (
		<table className="NLT__Table">
			<thead>
				<tr>
					{headers.map((header) => (
						<th
							key={header.id}
							onClick={(e) => header.onClick(e, header)}
						>
							{header.content}
						</th>
					))}
					<th>
						<button onClick={onAddColumn}>New</button>
					</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.id}>{row.content}</tr>
				))}
			</tbody>
			<tfoot>
				<tr>
					<td>
						<button onClick={onAddRow}>New</button>
					</td>
					{headers.map((header) => (
						<td key={header.id}></td>
					))}
				</tr>
			</tfoot>
		</table>
	);
}
