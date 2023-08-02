import { useLogger } from "../../../shared/logger";
import { useLoomState } from "../loom-state-provider";
import RowAddCommand from "../../../shared/loom-state/commands/row-add-command";
import RowDeleteCommand from "../../../shared/loom-state/commands/row-delete-command";
import React from "react";

export const useRow = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	const handleRowDeleteClick = React.useCallback(
		(rowId: string) => {
			logger("handleRowDeleteClick", {
				rowId,
			});
			doCommand(new RowDeleteCommand({ id: rowId }));
		},
		[doCommand, logger]
	);

	function handleNewRowClick() {
		logger("handleNewRowClick");
		doCommand(new RowAddCommand());
	}

	return {
		handleNewRowClick,
		handleRowDeleteClick,
	};
};
