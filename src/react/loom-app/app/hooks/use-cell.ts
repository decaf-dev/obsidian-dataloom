import React from "react";

import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import CellBodyUpdateCommand from "src/shared/loom-state/commands/cell-body-update-command";

export const useCell = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleExternalLinkToggle(
		cellId: string,
		rowId: string,
		value: boolean
	) {
		logger("handleExternalLinkToggle", {
			cellId,
			value,
		});

		doCommand(
			new CellBodyUpdateCommand(cellId, rowId, "isExternalLink", value)
		);
	}

	const handleBodyCellContentChange = React.useCallback(
		(cellId: string, rowId: string, value: string) => {
			logger("handleCellContentChange", {
				cellId,
				rowId,
				markdown: value,
			});

			doCommand(
				new CellBodyUpdateCommand(cellId, rowId, "markdown", value)
			);
		},
		[logger, doCommand]
	);

	const handleCellDateTimeChange = React.useCallback(
		(cellId: string, rowId: string, value: number | null) => {
			logger("handleCellContentChange", {
				cellId,
				rowId,
				dateTime: value,
			});

			doCommand(
				new CellBodyUpdateCommand(cellId, rowId, "dateTime", value)
			);
		},
		[logger, doCommand]
	);

	return {
		onBodyCellContentChange: handleBodyCellContentChange,
		onCellDateTimeChange: handleCellDateTimeChange,
		onExternalLinkToggle: handleExternalLinkToggle,
	};
};
