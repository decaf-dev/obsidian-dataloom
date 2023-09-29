import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import CellBodyUpdateCommand from "src/shared/loom-state/commands/cell-body-update-command";
import { Cell } from "src/shared/loom-state/types/loom-state";

export const useCell = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleCellChange(
		id: string,
		value: Partial<Cell>,
		isPartial = true
	) {
		logger("handleCellChange", {
			id,
			value,
			isPartial,
		});

		doCommand(new CellBodyUpdateCommand(id, value, isPartial));
	}

	return {
		onCellChange: handleCellChange,
	};
};
