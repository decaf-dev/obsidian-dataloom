import Logger from "js-logger";
import React from "react";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import CellBodyUpdateCommand from "src/shared/loom-state/commands/cell-body-update-command";
import { type Cell } from "src/shared/loom-state/types/loom-state";

export const useCell = () => {
	const { doCommand } = useLoomState();

	const handleCellChange = React.useCallback(
		(id: string, value: Partial<Cell>, isPartial = true) => {
			Logger.trace("handleCellChange", {
				id,
				value,
				isPartial,
			});

			doCommand(new CellBodyUpdateCommand(id, value, isPartial));
		},
		[doCommand]
	);

	return {
		onCellChange: handleCellChange,
	};
};
