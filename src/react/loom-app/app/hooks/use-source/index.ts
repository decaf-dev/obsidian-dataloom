import React from "react";

import { Source } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";
import findDataFromSources from "src/shared/loom-state/find-data-from-sources";
import { useAppMount } from "src/react/loom-app/app-mount-provider";
import EventManager from "src/shared/event/event-manager";

export const useSource = () => {
	const logger = useLogger();
	const { app } = useAppMount();
	const { doCommand, loomState, setLoomState } = useLoomState();

	const { sources, columns } = loomState.model;

	const frontmatterKeyHash = React.useMemo(() => {
		return JSON.stringify(
			columns.map((column) => column.frontmatterKey?.key)
		);
	}, [columns]);

	const updateRowsFromSources = React.useCallback(() => {
		logger("updateRowsFromSources called");
		setLoomState((prevState) => {
			if (Date.now() - prevState.time < 100) {
				logger("Less than 100ms since last save. Returning...");
				return prevState;
			}
			const { sources, columns, rows } = prevState.state.model;
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
				state: {
					...prevState.state,
					model: {
						...prevState.state.model,
						rows: nextRows,
						columns: nextColumns,
					},
				},
				shouldSaveToDisk: false,
				time: Date.now(),
			};
		});
	}, [app, setLoomState, logger]);

	React.useEffect(() => {
		updateRowsFromSources();
	}, [sources.length, frontmatterKeyHash, updateRowsFromSources]);

	React.useEffect(() => {
		EventManager.getInstance().on("file-create", updateRowsFromSources);
		EventManager.getInstance().on(
			"file-frontmatter-change",
			updateRowsFromSources
		);
		EventManager.getInstance().on("file-delete", updateRowsFromSources);
		EventManager.getInstance().on("folder-delete", updateRowsFromSources);
		EventManager.getInstance().on("folder-rename", updateRowsFromSources);
		EventManager.getInstance().on("file-rename", updateRowsFromSources);

		return () => {
			EventManager.getInstance().off(
				"file-create",
				updateRowsFromSources
			);
			EventManager.getInstance().off(
				"file-frontmatter-change",
				updateRowsFromSources
			);
			EventManager.getInstance().off(
				"folder-rename",
				updateRowsFromSources
			);
			EventManager.getInstance().off(
				"file-rename",
				updateRowsFromSources
			);
			EventManager.getInstance().off(
				"file-delete",
				updateRowsFromSources
			);
			EventManager.getInstance().off(
				"folder-delete",
				updateRowsFromSources
			);
		};
	}, [updateRowsFromSources, app]);

	function handleSourceAdd(source: Source) {
		logger("handleSourceAdd");
		doCommand(new SourceAddCommand(source));
	}

	function handleSourceDelete(id: string) {
		logger("handleSourceDelete", { id });
		doCommand(new SourceDeleteCommand(id));
	}

	return {
		onSourceAdd: handleSourceAdd,
		onSourceDelete: handleSourceDelete,
	};
};
