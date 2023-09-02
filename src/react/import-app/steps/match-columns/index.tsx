import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";
import Padding from "src/react/shared/padding";

import "./styles.css";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	activeColumns: number[];
	data: string[][];
	onColumnToggle: (index: number) => void;
}

export default function MatchColumns({
	data,
	activeColumns,
	onColumnToggle,
}: Props) {
	const overflowClassName = useOverflow(false);
	if (data.length === 0) return <></>;
	return (
		<div className="dataloom-match-columns">
			<table>
				<thead>
					<tr>
						{data[0].map((header, i) => {
							const isColumnActive = activeColumns.includes(i);
							let className = overflowClassName;
							if (!isColumnActive)
								className +=
									" dataloom-match-columns--disabled";
							return (
								<th key={i} className={className}>
									<Padding px="md" py="sm">
										<Stack
											isHorizontal
											justify="space-between"
											spacing="md"
											width="100%"
										>
											<Text value={header} />
											<input
												aria-label="Import column"
												type="checkbox"
												checked={isColumnActive}
												onChange={() =>
													onColumnToggle(i)
												}
											/>
										</Stack>
									</Padding>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{data.slice(1).map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => {
								const isCellActive = activeColumns.includes(j);
								let className = overflowClassName;
								if (!isCellActive)
									className +=
										" dataloom-match-columns--disabled";
								return (
									<td key={j} className={className}>
										{cell}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
