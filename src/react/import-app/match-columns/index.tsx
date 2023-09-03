import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";
import Padding from "src/react/shared/padding";

import { useOverflow } from "src/shared/spacing/hooks";

import "./styles.css";
import Button from "src/react/shared/button";

interface Props {
	columnsToImport: number[];
	data: string[][];
	onColumnToggle: (index: number) => void;
	onSelectAllColumns: () => void;
	onDeselectAllColumns: () => void;
}

export default function MatchColumns({
	data,
	columnsToImport,
	onColumnToggle,
	onSelectAllColumns,
	onDeselectAllColumns,
}: Props) {
	const overflowClassName = useOverflow(false, {
		ellipsis: true,
	});

	if (data.length === 0) return <></>;
	return (
		<div className="dataloom-match-columns">
			<Stack spacing="xl">
				<Stack isHorizontal spacing="md">
					<Button isSmall variant="text" onClick={onSelectAllColumns}>
						Select all
					</Button>
					<Button
						isSmall
						variant="text"
						onClick={onDeselectAllColumns}
					>
						Deselect all
					</Button>
				</Stack>
				<div className="dataloom-match-columns__container">
					<table>
						<thead>
							<tr>
								{data[0].map((header, i) => {
									const isColumnActive =
										columnsToImport.includes(i);
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
														aria-label="Toggle column"
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
										const isCellActive =
											columnsToImport.includes(j);
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
				<Text
					size="xs"
					variant="semibold"
					value={`Importing ${columnsToImport.length} of ${data.length} columns`}
				/>
			</Stack>
		</div>
	);
}
