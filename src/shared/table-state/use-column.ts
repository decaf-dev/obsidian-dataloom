import React from "react";
import {
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
} from "src/shared/types/types";
import { useLogger } from "../logger";
import { WorkspaceLeaf } from "obsidian";
import { EVENT_COLUMN_ADD, EVENT_COLUMN_DELETE } from "../events";
import { useTableState } from "./table-state-context";
import ColumnAddCommand from "../commands/column-add-command";
import ColumnDeleteCommand from "../commands/column-delete-command";
import ColumnUpdateCommand from "../commands/column-update-command";
import { ColumnTypeUpdateCommand } from "../commands/column-type-update-command";

export const useColumn = (viewLeaf: WorkspaceLeaf) => {
	const logFunc = useLogger();
	const { doCommand } = useTableState();

	React.useEffect(() => {
		function handleColumnAddEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				logFunc("handleColumnAddEvent");
				doCommand(new ColumnAddCommand());
			}
		}

		function handleColumnDeleteEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				logFunc("handleColumnDeleteEvent");
				doCommand(new ColumnDeleteCommand({ last: true }));
			}
		}
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_COLUMN_ADD, handleColumnAddEvent);

		//@ts-expect-error missing overload
		app.workspace.on(EVENT_COLUMN_DELETE, handleColumnDeleteEvent);

		return () => {
			app.workspace.off(EVENT_COLUMN_ADD, handleColumnAddEvent);
			app.workspace.off(EVENT_COLUMN_DELETE, handleColumnDeleteEvent);
		};
	}, [viewLeaf, doCommand]);

	function handleNewColumnClick() {
		logFunc("handleNewColumnClick");
		doCommand(new ColumnAddCommand());
	}
	function handleColumnTypeClick(columnId: string, type: CellType) {
		logFunc("handleColumnTypeClick", {
			columnId,
			type,
		});
		doCommand(new ColumnTypeUpdateCommand(columnId, type));
	}

	function handleColumnSortClick(columnId: string, sortDir: SortDir) {
		logFunc("handleColumnSortClick", {
			columnId,
			sortDir,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "sortDir", {
				value: sortDir,
				shouldSortRows: true,
			})
		);
	}

	function handleColumnToggle(columnId: string) {
		logFunc("handleColumnToggle", {
			columnId,
		});
		doCommand(new ColumnUpdateCommand(columnId, "isVisible"));
	}

	function handleColumnDeleteClick(columnId: string) {
		logFunc("handleColumnDeleteClick", {
			columnId,
		});
		doCommand(new ColumnDeleteCommand({ id: columnId }));
	}

	function handleCurrencyChange(
		columnId: string,
		currencyType: CurrencyType
	) {
		logFunc("handleCurrencyChange", {
			columnId,
			currencyType,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "currencyType", {
				value: currencyType,
				shouldSortRows: true,
			})
		);
	}

	function handleDateFormatChange(columnId: string, dateFormat: DateFormat) {
		logFunc("handleDateFormatChange", {
			columnId,
			dateFormat,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "dateFormat", {
				value: dateFormat,
				shouldSortRows: true,
			})
		);
	}

	function handleSortRemoveClick(columnId: string) {
		logFunc("handleSortRemoveClick", {
			columnId,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "sortDir", {
				value: SortDir.NONE,
				shouldSortRows: true,
			})
		);
	}

	function handleColumnWidthChange(columnId: string, width: string) {
		logFunc("handleColumnWidthChange", {
			columnId,
			width,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "width", {
				value: width,
				shouldSortRows: true,
			})
		);
	}

	function handleWrapContentToggle(columnId: string, shouldWrap: boolean) {
		logFunc("handleWrapContentToggle", {
			columnId,
			shouldWrap,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "shouldWrapOverflow", {
				value: shouldWrap,
				shouldSortRows: true,
			})
		);
	}

	return {
		handleNewColumnClick,
		handleColumnTypeClick,
		handleColumnSortClick,
		handleColumnToggle,
		handleColumnDeleteClick,
		handleCurrencyChange,
		handleDateFormatChange,
		handleSortRemoveClick,
		handleColumnWidthChange,
		handleWrapContentToggle,
	};
};
