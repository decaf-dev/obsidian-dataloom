import React from "react";

import Text from "src/react/shared/text";
import BodyCell from "./body-cell";
import HeaderCell from "./header-cell";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import MenuButton from "src/react/shared/menu-button";

import { Column } from "src/shared/loom-state/types/loom-state";
import { ColumnMatch } from "../types";
import {
	useMenu,
	useMenuOperations,
} from "src/react/shared/menu-provider/hooks";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";

import "./styles.css";
import BulkOptionsMenu from "./bulk-options-menu";

interface Props {
	columns: Column[];
	columnMatches: ColumnMatch[];
	enabledColumnIndices: number[];
	data: string[][];
	onColumnEnabledToggle: (index: number) => void;
	onAllColumnsEnabledToggle: (isEnabled: boolean) => void;
	onColumnMatch: (index: number, columnId: string | null) => void;
	onAllColumnsMatch: (columnId: string | null) => void;
}

export default function MatchColumns({
	columns,
	columnMatches,
	data,
	enabledColumnIndices,
	onColumnEnabledToggle,
	onAllColumnsEnabledToggle,
	onAllColumnsMatch,
	onColumnMatch,
}: Props) {
	const containerRef = React.useRef<HTMLDivElement>(null);

	const COMPONENT_ID = "match-columns";
	const menu = useMenu(COMPONENT_ID);

	const menuOperations = useMenuOperations();

	/**
	 * Closes all menus when the user scrolls.
	 */
	React.useEffect(() => {
		function handleScroll() {
			menuOperations.onCloseAll();
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
	}, [menuOperations]);

	function handleAllColumnsMatch(columnId: string | null) {
		onAllColumnsMatch(columnId);
		menu.onClose();
	}

	function handleAllColumnsEnabledToggle(isEnabled: boolean) {
		onAllColumnsEnabledToggle(isEnabled);
		menu.onClose();
	}

	let numUnmatched = enabledColumnIndices.length - columnMatches.length;
	if (numUnmatched < 0) numUnmatched = 0;

	let infoMessage = "";
	if (enabledColumnIndices.length === 0) {
		infoMessage = "You must enable at least one column";
	} else if (numUnmatched === 0) {
		infoMessage = "All columns matched";
	} else if (numUnmatched === 1) {
		infoMessage = `There is 1 unmatched column. Please match it to continue`;
	} else {
		infoMessage = `There are ${numUnmatched} unmatched columns. Please match them to continue`;
	}

	return (
		<>
			<div className="dataloom-match-columns">
				<Padding pb="lg">
					<div style={{ width: "fit-content" }}>
						<MenuButton
							menuId={menu.id}
							variant="link"
							isFocused={menu.isTriggerFocused}
							ref={menu.triggerRef}
							level={LoomMenuLevel.ONE}
							onOpen={() =>
								menu.onOpen(LoomMenuLevel.ONE, {
									shouldFocusTriggerOnClose: false,
								})
							}
						>
							Bulk operations
						</MenuButton>
					</div>
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
											(match) =>
												match.importColumnIndex === i
										)?.columnId ?? null;
									return (
										<HeaderCell
											key={i}
											isDisabled={
												!enabledColumnIndices.includes(
													i
												)
											}
											columnMatches={columnMatches}
											columns={columns}
											index={i}
											matchId={matchId}
											importValue={header}
											onColumnEnabledToggle={
												onColumnEnabledToggle
											}
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
												!enabledColumnIndices.includes(
													j
												)
											}
										/>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Padding pt="3xl">
					<Stack spacing="sm">
						<Text
							size="sm"
							variant="semibold"
							value={`Importing ${enabledColumnIndices.length} of ${data[0].length} columns`}
						/>
						<Text size="sm" variant="muted" value={infoMessage} />
					</Stack>
				</Padding>
			</div>
			<BulkOptionsMenu
				id={menu.id}
				isOpen={menu.isOpen}
				position={menu.position}
				onAllColumnsEnabledToggle={handleAllColumnsEnabledToggle}
				onAllColumnsMatch={handleAllColumnsMatch}
			/>
		</>
	);
}
