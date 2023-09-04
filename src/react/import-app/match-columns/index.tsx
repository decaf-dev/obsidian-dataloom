import Text from "src/react/shared/text";
import Button from "src/react/shared/button";

import BodyCell from "./body-cell";
import HeaderCell from "./header-cell";

import { ColumnMatch, ImportColumn } from "../types";

import "./styles.css";
import Padding from "src/react/shared/padding";
import { useMenuOperations } from "src/react/shared/menu/hooks";
import React from "react";

interface Props {
	columns: ImportColumn[];
	columnMatches: ColumnMatch[];
	enabledColumnIndices: number[];
	data: string[][];
	onColumnToggle: (index: number) => void;
	onAllColumnsToggle: () => void;
	onColumnMatch: (index: number, columnId: string) => void;
}

export default function MatchColumns({
	columns,
	columnMatches,
	data,
	enabledColumnIndices,
	onColumnToggle,
	onAllColumnsToggle,
	onColumnMatch,
}: Props) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const { onCloseAll } = useMenuOperations();

	/**
	 * Closes all menus when the user scrolls.
	 */
	React.useEffect(() => {
		function handleScroll() {
			onCloseAll();
		}

		if (!containerRef.current) return;
		const containerEl = containerRef.current;
		const appEl = containerEl.closest(".dataloom-import-app");
		if (!appEl) return;

		appEl.addEventListener("scroll", handleScroll);
		containerEl.addEventListener("scroll", handleScroll);

		return () => {
			appEl.removeEventListener("scroll", handleScroll);
			containerEl.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="dataloom-match-columns">
			<Padding py="xl">
				<Button variant="default" onClick={onAllColumnsToggle}>
					Toggle all
				</Button>
			</Padding>
			<div
				ref={containerRef}
				className="dataloom-match-columns__container"
			>
				<table>
					<thead>
						<tr>
							{data[0].map((header, i) => {
								const matchId =
									columnMatches.find(
										(match) => match.index === i
									)?.columnId ?? null;
								return (
									<HeaderCell
										key={i}
										isDisabled={
											!enabledColumnIndices.includes(i)
										}
										columns={columns}
										index={i}
										matchId={matchId}
										importValue={header}
										onColumnToggle={onColumnToggle}
										onColumnMatch={onColumnMatch}
									/>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{data.slice(1).map((row, i) => (
							<tr key={i}>
								{row.map((cell, j) => (
									<BodyCell
										key={j}
										value={cell}
										isDisabled={
											!enabledColumnIndices.includes(j)
										}
									/>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Padding pt="2xl" pb="lg">
				<Text
					size="sm"
					value={`Importing ${enabledColumnIndices.length} of ${data[0].length} columns`}
				/>
			</Padding>
		</div>
	);
}
