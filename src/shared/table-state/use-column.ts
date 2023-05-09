import React, { SetStateAction } from "react";
import {
	CellType,
	CurrencyType,
	DateFormat,
	SortDir,
	TableState,
} from "src/shared/table-state/types";
import { useLogger } from "../logger";
import {
	ColumnAddCommand,
	ColumnDeleteCommand,
	columnChangeType,
	columnSort,
	columnUpdate,
} from "./column-state-operations";
import { WorkspaceLeaf } from "obsidian";
import { updateSortTime } from "src/redux/global/global-slice";
import { EVENT_COLUMN_ADD, EVENT_COLUMN_DELETE } from "../events";
import { useAppDispatch } from "src/redux/global/hooks";
import { useTableState } from "./table-state-context";

export const useColumn = (
	viewLeaf: WorkspaceLeaf,
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const dispatch = useAppDispatch();
	const logFunc = useLogger();
	const { doCommand } = useTableState();

	React.useEffect(() => {
		function handleColumnAddEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
				doCommand(new ColumnAddCommand());
			}
		}

		function handleColumnDeleteEvent(leaf: WorkspaceLeaf) {
			if (leaf === viewLeaf) {
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
	}, [app, viewLeaf]);

	function handleNewColumnClick() {
		logFunc("handleNewColumnClick");
		doCommand(new ColumnAddCommand());
	}
	function handleHeaderTypeClick(columnId: string, type: CellType) {
		logFunc("handleHeaderTypeClick", {
			columnId,
			type,
		});
		onChange((prevState) => columnChangeType(prevState, columnId, type));
	}

	function handleHeaderSortSelect(columnId: string, sortDir: SortDir) {
		logFunc("handleHeaderSortSelect", {
			columnId,
			sortDir,
		});
		onChange((prevState) => columnSort(prevState, columnId, sortDir));
		dispatch(updateSortTime());
	}

	function handleColumnToggle(columnId: string) {
		logFunc("handleColumnToggle", {
			columnId,
		});
		onChange((prevState) => columnUpdate(prevState, columnId, "isVisible"));
	}

	function handleHeaderDeleteClick(columnId: string) {
		logFunc("handleHeaderDeleteClick", {
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
		onChange((prevState) =>
			columnUpdate(prevState, columnId, "currencyType", currencyType)
		);
		dispatch(updateSortTime());
	}

	function handleDateFormatChange(columnId: string, dateFormat: DateFormat) {
		logFunc("handleDateFormatChange", {
			columnId,
			dateFormat,
		});
		onChange((prevState) =>
			columnUpdate(prevState, columnId, "dateFormat", dateFormat)
		);
		dispatch(updateSortTime());
	}

	function handleSortRemoveClick(columnId: string) {
		logFunc("handleSortRemoveClick", {
			columnId,
		});
		onChange((prevState) => columnSort(prevState, columnId, SortDir.NONE));
		dispatch(updateSortTime());
	}

	function handleHeaderWidthChange(columnId: string, width: string) {
		logFunc("handleHeaderWidthChange", {
			columnId,
			width,
		});
		onChange((prevState) =>
			columnUpdate(prevState, columnId, "width", width)
		);
	}

	function handleWrapContentToggle(columnId: string, value: boolean) {
		logFunc("handleWrapContentToggle", {
			columnId,
			value,
		});
		onChange((prevState) =>
			columnUpdate(prevState, columnId, "shouldWrapOverflow", value)
		);
	}

	return {
		handleNewColumnClick,
		handleHeaderTypeClick,
		handleHeaderSortSelect,
		handleColumnToggle,
		handleHeaderDeleteClick,
		handleCurrencyChange,
		handleDateFormatChange,
		handleSortRemoveClick,
		handleHeaderWidthChange,
		handleWrapContentToggle,
	};
};
