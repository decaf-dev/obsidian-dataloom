import { useLogger } from "../logger";
import { useLoomState } from "./loom-state-context";
import CellBodyUpdateCommand from "../commands/cell-body-update-command";
import CellHeaderUpdateCommand from "../commands/cell-header-update-command";
import React from "react";

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

	function handleHeaderCellContentChange(cellId: string, value: string) {
		logger("handleCellContentChange", {
			cellId,
			markdown: value,
		});

		doCommand(new CellHeaderUpdateCommand(cellId, "markdown", value));
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
		handleHeaderCellContentChange,
		handleBodyCellContentChange,
		handleCellDateTimeChange,
		handleExternalLinkToggle,
	};
};
