import React from "react";

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

import "src/react/global.css";
import "./styles.css";
import getHeaderRow from "./get-header-row";
import { filterUniqueRows } from "src/shared/loom-state/utils/row-utils";
import { CellType } from "src/shared/loom-state/types/loom-state";
import FileCache from "src/shared/file-cache";
import findDataFromSources from "src/shared/loom-state/source-rows";

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
	const { onRequestCloseTop } = useMenuOperations();

	useExportEvents(loomState);
	useRowEvents();
	useColumnEvents();
	useMenuEvents();
	const { onSourceAdd, onSourceDelete } = useSource();

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
	} = useColumn();

	const {
		onRowAddClick,
		onRowDeleteClick,
		onRowInsertAboveClick,
		onRowInsertBelowClick,
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

	//Add source rows on mount
	React.useEffect(() => {
		//Set timeout to avoid Obsidian merging file message
		setLoomState((prevState) => {
			const { sources, columns, rows } = prevState.model;
			const result = findDataFromSources(
				app,
				FileCache.getInstance(),
				sources,
				columns,
				rows.length
			);
			const { newRows, nextColumns } = result;
			let nextRows = [...rows, ...newRows];
			nextRows = filterUniqueRows(
				columns,
				nextRows,
				CellType.SOURCE_FILE
			);
			return {
				...prevState,
				model: {
					...prevState.model,
					rows: nextRows,
					columns: nextColumns,
				},
			};
		});
	}, [setLoomState, app]);

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

	const { columns, filters, settings, sources } = loomState.model;
	const { numFrozenColumns, showCalculationRow } = settings;

	let filteredRows = filterByFilters(loomState);
	filteredRows = filterRowsBySearch(
		sources,
		columns,
		filteredRows,
		searchText
	);

	const visibleColumns = columns.filter((column) => column.isVisible);
	const headerRow = getHeaderRow({
		firstColumnId,
		lastColumnId,
		visibleColumns,
		numColumns: columns.length,
		numSources: sources.length,
		onColumnChange,
		onFrozenColumnsChange,
		onColumnDeleteClick,
		onColumnAddClick,
		onColumnTypeChange,
		numFrozenColumns,
		resizingColumnId,
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

	return (
		<div
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
				numFrozenColumns={numFrozenColumns}
				ref={tableRef}
				headerRow={headerRow}
				bodyRows={bodyRows}
				footer={footerRow}
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
