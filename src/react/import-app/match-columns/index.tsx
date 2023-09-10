import Text from "src/react/shared/text";
import Button from "src/react/shared/button";

import BodyCell from "./body-cell";
import HeaderCell from "./header-cell";

import { ColumnMatch, ImportColumn } from "../types";

import "./styles.css";
import Padding from "src/react/shared/padding";
import { useMenuOperations } from "src/react/shared/menu/hooks";
import React from "react";
import Stack from "src/react/shared/stack";

interface Props {
	columns: ImportColumn[];
	columnMatches: ColumnMatch[];
	enabledColumnIndices: number[];
	data: string[][];
	onColumnToggle: (index: number) => void;
	onAllColumnsToggle: () => void;
	onColumnMatch: (index: number, columnId: string | null) => void;
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
		window.addEventListener("resize", handleScroll);

		return () => {
			appEl.removeEventListener("scroll", handleScroll);
			containerEl.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [onCloseAll]);

	let numUnmatched = enabledColumnIndices.length - columnMatches.length;
	if (numUnmatched < 0) numUnmatched = 0;

	return (
		<div className="dataloom-match-columns">
			<Padding pb="lg">
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
										(match) => match.importColumnIndex === i
									)?.columnId ?? null;
								return (
									<HeaderCell
										key={i}
										isDisabled={
											!enabledColumnIndices.includes(i)
										}
										columnMatches={columnMatches}
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
			<Padding pt="3xl" pb="lg">
				<Stack spacing="lg">
					<Text
						size="sm"
						variant="semibold"
						value={`Importing ${enabledColumnIndices.length} of ${data[0].length} columns`}
					/>
					{numUnmatched > 0 && (
						<Text
							size="sm"
							variant="muted"
							value={
								"There are " +
								numUnmatched +
								" unmatched columns. Please match them to continue."
							}
						/>
					)}
				</Stack>
			</Padding>
		</div>
	);
}
