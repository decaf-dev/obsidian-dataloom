import React from "react";

import { Source } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";
import findDataFromSources from "src/shared/loom-state/find-data-from-sources";
import { useAppMount } from "src/react/loom-app/app-mount-provider";

export const useSource = () => {
	const logger = useLogger();
	const { app } = useAppMount();
	const { doCommand, setLoomState } = useLoomState();

	function handleSourceAdd(source: Source) {
		logger("handleSourceAdd");
		doCommand(new SourceAddCommand(source));
	}

	function handleSourceDelete(id: string) {
		logger("handleSourceDelete", { id });
		doCommand(new SourceDeleteCommand(id));
	}

	const handleUpdateRowsFromSources = React.useCallback(() => {
		setLoomState((prevState) => {
			const { sources, columns, rows } = prevState.model;
			const result = findDataFromSources(
				app,
				sources,
				columns,
				rows.length
			);
			const { newRows, nextColumns } = result;
			const internalRows = rows.filter((row) => row.sourceId === null);
			const nextRows = [...internalRows, ...newRows];
			return {
				...prevState,
				model: {
					...prevState.model,
					rows: nextRows,
					columns: nextColumns,
				},
			};
		});
	}, [setLoomState, app]);

	return {
		onSourceAdd: handleSourceAdd,
		onSourceDelete: handleSourceDelete,
		onUpdateRowsFromSources: handleUpdateRowsFromSources,
	};
};
