import React from "react";

import {
	AspectRatio,
	CalculationType,
	CellType,
	CurrencyType,
	DateFormat,
	PaddingSize,
	SortDir,
} from "src/shared/loom-state/types";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../loom-state-provider";
import ColumnAddCommand from "src/shared/loom-state/commands/column-add-command";
import ColumnDeleteCommand from "src/shared/loom-state/commands/column-delete-command";
import ColumnUpdateCommand from "src/shared/loom-state/commands/column-update-command";
import { ColumnTypeUpdateCommand } from "src/shared/loom-state/commands/column-type-update-command";

export const useColumn = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

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

	function handleColumnHideClick(columnId: string) {
		logger("handleColumnHideClick", {
			columnId,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, "isVisible", { value: false })
		);
	}

	function handleColumnDeleteClick(columnId: string) {
		logger("handleColumnDeleteClick", {
			columnId,
		});
		doCommand(new ColumnDeleteCommand({ id: columnId }));
	}

	function handleCalculationTypeChange(
		columnId: string,
		calculationType: CalculationType
	) {
		logger("handleCalculationTypeChange", {
			columnId,
			calculationType,
		});

		doCommand(
			new ColumnUpdateCommand(columnId, "calculationType", {
				value: calculationType,
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
		handleCalculationTypeChange,
		handleHorizontalPaddingClick,
		handleVerticalPaddingClick,
		handleAspectRatioClick,
		handleColumnHideClick,
	};
};
