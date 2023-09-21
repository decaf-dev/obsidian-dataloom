import {
	AspectRatio,
	CalculationType,
	CellType,
	CurrencyType,
	DateFormat,
	NumberFormat,
	PaddingSize,
	SortDir,
} from "src/shared/loom-state/types/loom-state";
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
			new ColumnUpdateCommand(
				columnId,
				{
					sortDir,
				},
				{
					shouldSortRows: true,
				}
			)
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
			new ColumnUpdateCommand(columnId, {
				horizontalPadding: padding,
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
			new ColumnUpdateCommand(columnId, {
				verticalPadding: padding,
			})
		);
	}

	function handleAspectRatioClick(columnId: string, ratio: AspectRatio) {
		logger("handleAspectRatioClick", {
			columnId,
			ratio,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, {
				aspectRatio: ratio,
			})
		);
	}

	function handleColumnToggle(columnId: string, isVisible: boolean) {
		logger("handleColumnToggle", {
			columnId,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, {
				isVisible,
			})
		);
	}

	function handleColumnHideClick(columnId: string) {
		logger("handleColumnHideClick", {
			columnId,
		});
		doCommand(
			new ColumnUpdateCommand(columnId, {
				isVisible: false,
			})
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
			new ColumnUpdateCommand(
				columnId,
				{
					calculationType,
				},
				{}
			)
		);
	}

	function handleNumberPrefixChange(columnId: string, prefix: string) {
		logger("handleNumberPrefixChange", { columnId, prefix });
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					numberPrefix: prefix,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}
	function handleNumberSeparatorChange(columnId: string, separator: string) {
		logger("handleNumberSeparatorChange", { columnId, separator });
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					numberSeparator: separator,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}
	function handleNumberSuffixChange(columnId: string, suffix: string) {
		logger("handleNumberSuffixChange", { columnId, suffix });
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					numberSuffix: suffix,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}
	function handleNumberFormatChange(
		columnId: string,
		format: NumberFormat,
		options?: {
			currency: CurrencyType;
		}
	) {
		logger("handleNumberFormatChange", {
			columnId,
			format,
			options,
		});

		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					numberFormat: format,
					...(options?.currency && {
						currencyType: options.currency,
					}),
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}

	function handleDateFormatChange(columnId: string, format: DateFormat) {
		logger("handleDateFormatChange", {
			columnId,
			format,
		});
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					dateFormat: format,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}

	function handleSortRemoveClick(columnId: string) {
		logger("handleSortRemoveClick", {
			columnId,
		});
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					sortDir: SortDir.NONE,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}

	function handleColumnWidthChange(columnId: string, width: string) {
		logger("handleColumnWidthChange", {
			columnId,
			width,
		});
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					width,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}

	function handleWrapContentToggle(columnId: string, shouldWrap: boolean) {
		logger("handleWrapContentToggle", {
			columnId,
			shouldWrap,
		});
		doCommand(
			new ColumnUpdateCommand(
				columnId,
				{
					shouldWrapOverflow: shouldWrap,
				},
				{
					shouldSortRows: true,
				}
			)
		);
	}

	return {
		onColumnAddClick: handleNewColumnClick,
		onColumnTypeClick: handleColumnTypeClick,
		onColumnSortClick: handleColumnSortClick,
		onColumnToggle: handleColumnToggle,
		onColumnDeleteClick: handleColumnDeleteClick,
		onNumberFormatChange: handleNumberFormatChange,
		onNumberPrefixChange: handleNumberPrefixChange,
		onNumberSeparatorChange: handleNumberSeparatorChange,
		onNumberSuffixChange: handleNumberSuffixChange,
		onDateFormatChange: handleDateFormatChange,
		onSortRemoveClick: handleSortRemoveClick,
		onColumnWidthChange: handleColumnWidthChange,
		onWrapContentToggle: handleWrapContentToggle,
		onCalculationTypeChange: handleCalculationTypeChange,
		onHorizontalPaddingClick: handleHorizontalPaddingClick,
		onVerticalPaddingClick: handleVerticalPaddingClick,
		onAspectRatioClick: handleAspectRatioClick,
		onColumnHideClick: handleColumnHideClick,
	};
};
