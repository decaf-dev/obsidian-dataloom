import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../loom-state-provider";
import TableSettingsUpdateCommand from "src/shared/loom-state/commands/table-settings-update-command";

export const useTableSettings = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleFrozenColumnsChange(numColumns: number) {
		logger("handleFrozenColumnsChange", { numColumns });
		doCommand(
			new TableSettingsUpdateCommand("numFrozenColumns", numColumns)
		);
	}

	function handleCalculationRowToggle(value: boolean) {
		logger("handleCalculationRowToggle");
		doCommand(new TableSettingsUpdateCommand("showCalculationRow", value));
	}

	return {
		onFrozenColumnsChange: handleFrozenColumnsChange,
		onCalculationRowToggle: handleCalculationRowToggle,
	};
};
