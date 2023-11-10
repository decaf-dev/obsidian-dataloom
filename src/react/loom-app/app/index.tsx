import React from "react";

import { VirtuosoHandle } from "react-virtuoso";

import Table from "../table";
import OptionBar from "../option-bar";
import BottomBar from "../bottom-bar";

import { useLoomState } from "../loom-state-provider";
import { useFilter } from "./hooks/use-filter";
import { filterRowsBySearch } from "./filter-by-search";
import { useColumn } from "./hooks/use-column";
import { useRow } from "./hooks/use-row";
import { useCell } from "./hooks/use-cell";
import { useTag } from "./hooks/use-tag";
import { useAppMount } from "../app-mount-provider";
import { useExportEvents } from "src/react/loom-app/app/hooks/use-export-events";
import { useRowEvents } from "src/react/loom-app/app/hooks/use-row-events";
import { useColumnEvents } from "src/react/loom-app/app/hooks/use-column-events";
import { useTableSettings } from "./hooks/use-table-settings";
import useFocus from "./hooks/use-focus";

import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import { useLogger } from "src/shared/logger";
import { useSource } from "./hooks/use-source";

import "src/react/global.css";
import "./styles.css";
import { useAppEvents } from "./hooks/use-app-events";
import { useMenuEvents } from "./hooks/use-menu-events";
import EventManager from "src/shared/event/event-manager";

export default function App() {
	const logger = useLogger();
	const { reactAppId, isMarkdownView, app } = useAppMount();

	const {
		loomState,
		resizingColumnId,
		searchText,
		onRedo,
		onUndo,
		setLoomState,
	} = useLoomState();

	const tableRef = React.useRef<VirtuosoHandle | null>(null);
	const appRef = React.useRef<HTMLDivElement | null>(null);

	useExportEvents(loomState);
	useRowEvents();
	useColumnEvents();
	useMenuEvents();
	const { onClick } = useAppEvents();

	const { onSourceAdd, onSourceDelete, onUpdateRowsFromSources } =
		useSource();

	const { onFocusKeyDown } = useFocus();
	const { onFrozenColumnsChange, onCalculationRowToggle } =
		useTableSettings();

	const { onFilterAdd, onFilterUpdate, onFilterDelete, filterByFilters } =
		useFilter();

	const {
		onColumnDeleteClick,
		onColumnAddClick,
		onColumnTypeChange,
		onColumnChange,
		onColumnReorder,
	} = useColumn();

	const {
		onRowAddClick,
		onRowDeleteClick,
		onRowInsertAboveClick,
		onRowInsertBelowClick,
		onRowReorder,
	} = useRow();

	const { onCellChange } = useCell();

	const {
		onTagCellAdd,
		onTagAdd,
		onTagCellRemove,
		onTagCellMultipleRemove,
		onTagDeleteClick,
		onTagChange,
	} = useTag();

	const { columns, filters, settings, sources } = loomState.model;
	const { numFrozenColumns, showCalculationRow } = settings;

	const frontmatterKeyHash = React.useMemo(() => {
		return JSON.stringify(
			columns.map((column) => column.frontmatterKey?.value)
		);
	}, [columns]);

	//Add source rows on mount
	React.useEffect(() => {
		onUpdateRowsFromSources();
	}, [
		setLoomState,
		app,
		sources.length,
		frontmatterKeyHash,
		onUpdateRowsFromSources,
	]);

	React.useEffect(() => {
		EventManager.getInstance().on("file-create", onUpdateRowsFromSources);
		EventManager.getInstance().on(
			"file-frontmatter-change",
			onUpdateRowsFromSources
		);
		EventManager.getInstance().on("file-delete", onUpdateRowsFromSources);
		EventManager.getInstance().on("folder-delete", onUpdateRowsFromSources);
		EventManager.getInstance().on("folder-rename", onUpdateRowsFromSources);
		EventManager.getInstance().on("file-rename", onUpdateRowsFromSources);

		return () => {
			EventManager.getInstance().off(
				"file-create",
				onUpdateRowsFromSources
			);
			EventManager.getInstance().off(
				"file-frontmatter-change",
				onUpdateRowsFromSources
			);
			EventManager.getInstance().off(
				"folder-rename",
				onUpdateRowsFromSources
			);
			EventManager.getInstance().off(
				"file-rename",
				onUpdateRowsFromSources
			);
			EventManager.getInstance().off(
				"file-delete",
				onUpdateRowsFromSources
			);
			EventManager.getInstance().off(
				"folder-delete",
				onUpdateRowsFromSources
			);
		};
	}, [onUpdateRowsFromSources, app]);

	function handleScrollToTopClick() {
		tableRef.current?.scrollToIndex(0);
	}

	function handleScrollToBottomClick() {
		tableRef.current?.scrollToIndex(filteredRows.length - 1);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("App handleKeyDown");
		//Stop propagation to the global event
		e.stopPropagation();
		if (isWindowsRedoDown(e) || isMacRedoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			onRedo();
		} else if (isWindowsUndoDown(e) || isMacUndoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			onUndo();
		} else {
			onFocusKeyDown(e);
		}
	}

	let filteredRows = filterByFilters(loomState);
	filteredRows = filterRowsBySearch(
		sources,
		columns,
		filteredRows,
		searchText
	);

	let className = "dataloom-app";
	if (isMarkdownView) className += " dataloom-app--markdown-view";

	return (
		<div
			ref={appRef}
			id={reactAppId}
			className={className}
			onKeyDown={handleKeyDown}
			onClick={onClick}
		>
			<OptionBar
				columns={columns}
				sources={sources}
				filters={filters}
				showCalculationRow={showCalculationRow}
				onColumnChange={onColumnChange}
				onFilterAddClick={onFilterAdd}
				onFilterDeleteClick={onFilterDelete}
				onFilterUpdate={onFilterUpdate}
				onCalculationRowToggle={onCalculationRowToggle}
				onSourceAdd={onSourceAdd}
				onSourceDelete={onSourceDelete}
			/>
			<Table
				ref={tableRef}
				sources={sources}
				rows={filteredRows}
				columns={columns}
				numFrozenColumns={numFrozenColumns}
				resizingColumnId={resizingColumnId}
				showCalculationRow={showCalculationRow}
				onColumnDeleteClick={onColumnDeleteClick}
				onColumnAddClick={onColumnAddClick}
				onColumnTypeChange={onColumnTypeChange}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onColumnReorder={onColumnReorder}
				onRowDeleteClick={onRowDeleteClick}
				onRowInsertAboveClick={onRowInsertAboveClick}
				onRowInsertBelowClick={onRowInsertBelowClick}
				onColumnChange={onColumnChange}
				onCellChange={onCellChange}
				onTagAdd={onTagAdd}
				onTagCellAdd={onTagCellAdd}
				onTagCellRemove={onTagCellRemove}
				onTagCellMultipleRemove={onTagCellMultipleRemove}
				onTagChange={onTagChange}
				onTagDeleteClick={onTagDeleteClick}
				onRowReorder={onRowReorder}
			/>
			<BottomBar
				onRowAddClick={onRowAddClick}
				onScrollToTopClick={handleScrollToTopClick}
				onScrollToBottomClick={handleScrollToBottomClick}
				onUndoClick={onUndo}
				onRedoClick={onRedo}
			/>
		</div>
	);
}
