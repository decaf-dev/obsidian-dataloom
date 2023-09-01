import "./styles.css";

interface Props {
	data: string[][];
}

export default function AssignData({ data }: Props) {
	if (data.length === 0) return <></>;
	return (
		<div className="dataloom-assign-data">
			<table>
				<thead>
					<tr>
						{data[0].map((header, i) => (
							<th key={i}>{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.slice(1).map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => (
								<td key={j}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
