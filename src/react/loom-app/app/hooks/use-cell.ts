import React from "react";

import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import CellBodyUpdateCommand from "src/shared/loom-state/commands/cell-body-update-command";

export const useCell = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleExternalLinkToggle(id: string, value: boolean) {
		logger("handleExternalLinkToggle", {
			id,
			value,
		});
		doCommand(
			new CellBodyUpdateCommand(id, {
				isExternalLink: value,
			})
		);
	}

	function handleCellContentChange(id: string, value: string) {
		logger("handleCellContentChange", {
			id,
			value,
		});

		doCommand(
			new CellBodyUpdateCommand(id, {
				content: value,
			})
		);
	}

	const handleCellDateTimeChange = React.useCallback(
		(id: string, value: number | null) => {
			logger("handleCellContentChange", {
				id,
				dateTime: value,
			});

			doCommand(
				new CellBodyUpdateCommand(id, {
					dateTime: value,
				})
			);
		},
		[logger, doCommand]
	);

	return {
		onCellDateTimeChange: handleCellDateTimeChange,
		onCellContentChange: handleCellContentChange,
		onExternalLinkToggle: handleExternalLinkToggle,
	};
};
