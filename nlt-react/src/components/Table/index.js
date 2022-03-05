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
					<th className="NLT__hidden-column"></th>
					{headers.map((header) => (
						<th
							className="NLT__th"
							style={{ maxWidth: header.width }}
							key={header.id}
							onClick={header.onClick}
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
					<td className="NLT__hidden-column"></td>
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
