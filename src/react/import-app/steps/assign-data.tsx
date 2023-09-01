interface Props {
	data: (string | number)[][];
}

export default function AssignData({ data }: Props) {
	return (
		<table>
			<thead>
				<tr>
					{data[0].map((header) => (
						<th>{header}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.slice(1).map((row) => (
					<tr>
						{row.map((cell) => (
							<td>{cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
