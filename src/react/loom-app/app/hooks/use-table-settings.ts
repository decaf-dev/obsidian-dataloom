import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../loom-state-provider";
import TableSettingsUpdateCommand from "src/shared/loom-state/commands/table-settings-update-command";
import React from "react";

export const useTableSettings = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	const handleFrozenColumnsChange = React.useCallback(
		(numColumns: number) => {
			logger("handleFrozenColumnsChange", { numColumns });
			doCommand(
				new TableSettingsUpdateCommand("numFrozenColumns", numColumns)
			);
		},
		[doCommand, logger]
	);

	function handleCalculationRowToggle(value: boolean) {
		logger("handleCalculationRowToggle");
		doCommand(new TableSettingsUpdateCommand("showCalculationRow", value));
	}

	return {
		onFrozenColumnsChange: handleFrozenColumnsChange,
		onCalculationRowToggle: handleCalculationRowToggle,
	};
};
