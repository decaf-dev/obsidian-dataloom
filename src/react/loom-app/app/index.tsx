import React, { useCallback, useMemo } from "react";

import { VirtuosoHandle } from "react-virtuoso";

import Table from "../table";
import OptionBar from "../option-bar";
import BottomBar from "../bottom-bar";

import { useUUID } from "../../../shared/hooks";
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
import { useMenuEvents } from "./hooks/use-menu-events";
import { nltEventSystem } from "src/shared/event-system/event-system";
import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import { useLogger } from "src/shared/logger";
import { useMenuOperations } from "src/react/shared/menu/hooks";
import { useSource } from "./hooks/use-source";
import getBodyRows from "./get-body-rows";
import getFooterRow from "./get-footer-row";
import _ from "lodash";

import "src/react/global.css";
import "./styles.css";
import getHeaderRow from "./get-header-row";
import {
	EVENT_FILE_CREATE,
	EVENT_FILE_DELETE,
	EVENT_FILE_FRONTMATTER_CHANGE,
	EVENT_FILE_RENAME,
	EVENT_FOLDER_DELETE,
	EVENT_FOLDER_RENAME,
} from "src/shared/events";

export default function App() {
	const logger = useLogger();
	const { reactAppId, isMarkdownView, app } = useAppMount();
	const [bottomBarOffset, setBottomBarOffset] = React.useState(0);

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
	const { onRequestCloseTop } = useMenuOperations();

	useExportEvents(loomState);
	useRowEvents();
	useColumnEvents();
	useMenuEvents();
	const {
		allFrontMatterKeys,
		onSourceAdd,
		onSourceDelete,
		onUpdateRowsFromSources,
	} = useSource();

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

	const frontmatterKeyHash = useMemo(() => {
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
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_FILE_CREATE, onUpdateRowsFromSources);
		app.workspace.on(
			//@ts-expect-error missing overload
			EVENT_FILE_FRONTMATTER_CHANGE,
			onUpdateRowsFromSources
		);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_FILE_DELETE, onUpdateRowsFromSources);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_FOLDER_DELETE, onUpdateRowsFromSources);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_FOLDER_RENAME, onUpdateRowsFromSources);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_FILE_RENAME, onUpdateRowsFromSources);

		return () => {
			app.workspace.off(EVENT_FILE_CREATE, onUpdateRowsFromSources);
			app.workspace.off(
				EVENT_FILE_FRONTMATTER_CHANGE,
				onUpdateRowsFromSources
			);
			app.workspace.off(EVENT_FOLDER_RENAME, onUpdateRowsFromSources);
			app.workspace.off(EVENT_FILE_RENAME, onUpdateRowsFromSources);
			app.workspace.off(EVENT_FILE_DELETE, onUpdateRowsFromSources);
			app.workspace.off(EVENT_FOLDER_DELETE, onUpdateRowsFromSources);
		};
	}, [onUpdateRowsFromSources, app]);

	const firstColumnId = useUUID();
	const lastColumnId = useUUID();

	function handleScrollToTopClick() {
		tableRef.current?.scrollToIndex(0);
	}

	function handleScrollToBottomClick() {
		tableRef.current?.scrollToIndex(filteredRows.length - 1);
	}

	function handleClick(e: React.MouseEvent) {
		logger("App handleClick");
		//Stop propagation to the global event
		e.stopPropagation();

		onRequestCloseTop();
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
		nltEventSystem.dispatchEvent("keydown", e);
	}

	let filteredRows = filterByFilters(loomState);
	filteredRows = filterRowsBySearch(
		sources,
		columns,
		filteredRows,
		searchText
	);

	const visibleColumns = columns.filter((column) => column.isVisible);
	const headerRow = getHeaderRow({
		allFrontMatterKeys,
		firstColumnId,
		lastColumnId,
		columns,
		numFrozenColumns,
		resizingColumnId,
		numSources: sources.length,
		onColumnChange,
		onFrozenColumnsChange,
		onColumnDeleteClick,
		onColumnAddClick,
		onColumnTypeChange,
	});

	const bodyRows = getBodyRows({
		sources,
		firstColumnId,
		lastColumnId,
		visibleColumns,
		rows: filteredRows,
		onTagCellAdd,
		onTagAdd,
		onTagCellRemove,
		onTagCellMultipleRemove,
		onTagDeleteClick,
		onRowDeleteClick,
		onRowInsertAboveClick,
		onRowInsertBelowClick,
		onCellChange,
		onColumnChange,
		onTagChange,
		onRowReorder,
	});

	const footerRow = getFooterRow({
		showCalculationRow,
		firstColumnId,
		lastColumnId,
		visibleColumns,
		rows: filteredRows,
		sources,
		onColumnChange,
	});

	let className = "dataloom-app";
	if (isMarkdownView) className += " dataloom-app--markdown-view";

	const handleTableRender = useCallback(
		_.debounce(() => {
			const appEl = appRef.current;
			if (!appEl) return;

			const tableEl = appEl.querySelector(".dataloom-table");
			if (!tableEl) return;

			const tableContainerEl = tableEl.parentElement;
			if (!tableContainerEl) return;

			const tableRect = tableEl.getBoundingClientRect();
			const tableContainerRect = tableContainerEl.getBoundingClientRect();

			let diff = tableContainerRect.height - tableRect.height;
			if (diff < 0) diff = 0;
			setBottomBarOffset(diff);
		}, 10),
		[setBottomBarOffset, appRef]
	);

	return (
		<div
			ref={appRef}
			id={reactAppId}
			className={className}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
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
				numFrozenColumns={numFrozenColumns}
				headerRow={headerRow}
				bodyRows={bodyRows}
				footer={footerRow}
				onColumnReorder={onColumnReorder}
				onRowReorder={onRowReorder}
				onTableRender={handleTableRender}
			/>
			<BottomBar
				bottomBarOffset={bottomBarOffset}
				onRowAddClick={onRowAddClick}
				onScrollToTopClick={handleScrollToTopClick}
				onScrollToBottomClick={handleScrollToBottomClick}
				onUndoClick={onUndo}
				onRedoClick={onRedo}
			/>
		</div>
	);
}
