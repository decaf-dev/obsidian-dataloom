import { useLoomState } from "../../loom-state-provider";
import TableSettingsUpdateCommand from "src/shared/loom-state/commands/table-settings-update-command";
import React from "react";
import Logger from "js-logger";

export const useTableSettings = () => {
	const { doCommand } = useLoomState();

	const handleFrozenColumnsChange = React.useCallback(
		(numColumns: number) => {
			Logger.trace("handleFrozenColumnsChange", { numColumns });
			doCommand(
				new TableSettingsUpdateCommand("numFrozenColumns", numColumns)
			);
		},
		[doCommand]
	);

	function handleCalculationRowToggle(value: boolean) {
		Logger.trace("handleCalculationRowToggle");
		doCommand(new TableSettingsUpdateCommand("showCalculationRow", value));
	}

	return {
		onFrozenColumnsChange: handleFrozenColumnsChange,
		onCalculationRowToggle: handleCalculationRowToggle,
	};
};
