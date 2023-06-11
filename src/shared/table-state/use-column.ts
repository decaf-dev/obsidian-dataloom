import React from "react";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	PaddingSize,
	SortDir,
} from "src/shared/types";
import { useLogger } from "../logger";
import { useTableState } from "./table-state-context";
import ColumnAddCommand from "../commands/column-add-command";
import ColumnDeleteCommand from "../commands/column-delete-command";
import ColumnUpdateCommand from "../commands/column-update-command";
import { ColumnTypeUpdateCommand } from "../commands/column-type-update-command";

export const useColumn = () => {
	const logger = useLogger();
	const { doCommand } = useTableState();

	function handleNewColumnClick() {
		logger("handleNewColumnClick");
		doCommand(new ColumnAddCommand());
	}
	function handleColumnTypeClick(columnId: string, type: CellType) {
		logger("handleColumnTypeClick", {
			columnId,
			type,
		});
		doCommand(new ColumnTypeUpdateCommand(columnId, type));
	}

	function handleColumnSortClick(columnId: string, sortDir: SortDir) {
		logger("handleColumnSortClick", {
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

	function handleHorizontalPaddingClick(
		columnId: string,
		padding: PaddingSize
	) {
		logger("handleHorziontalPaddingClick", {
			columnId,
			padding,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "horizontalPadding", {
				value: padding,
			})
		);
	}

	function handleVerticalPaddingClick(
		columnId: string,
		padding: PaddingSize
	) {
		logger("handleVerticalPaddingClick", {
			columnId,
			padding,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "verticalPadding", {
				value: padding,
			})
		);
	}

	function handleAspectRatioClick(
		columnId: string,
		aspectRatio: AspectRatio
	) {
		logger("handleVerticalPaddingClick", {
			columnId,
			aspectRatio,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "aspectRatio", {
				value: aspectRatio,
			})
		);
	}

	const handleColumnToggle = React.useCallback(
		(columnId: string) => {
			logger("handleColumnToggle", {
				columnId,
			});
			doCommand(new ColumnUpdateCommand(columnId, "isVisible"));
		},
		[doCommand, logger]
	);

	function handleColumnDeleteClick(columnId: string) {
		logger("handleColumnDeleteClick", {
			columnId,
		});
		doCommand(new ColumnDeleteCommand({ id: columnId }));
	}

	function handleFunctionTypeChange(
		columnId: string,
		functionType: FunctionType
	) {
		logger("handleFunctionTypeChange", {
			columnId,
			functionType,
		});

		doCommand(
			new ColumnUpdateCommand(columnId, "functionType", {
				value: functionType,
			})
		);
	}

	function handleCurrencyChange(
		columnId: string,
		currencyType: CurrencyType
	) {
		logger("handleCurrencyChange", {
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
		logger("handleDateFormatChange", {
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
		logger("handleSortRemoveClick", {
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
		logger("handleColumnWidthChange", {
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
		logger("handleWrapContentToggle", {
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
		handleFunctionTypeChange,
		handleHorizontalPaddingClick,
		handleVerticalPaddingClick,
		handleAspectRatioClick,
	};
};
