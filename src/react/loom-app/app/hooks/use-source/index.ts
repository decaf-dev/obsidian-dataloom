import React from "react";

import Logger from "js-logger";
import { useAppMount } from "src/react/loom-app/app-mount-provider";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import EventManager from "src/shared/event/event-manager";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";
import SourceUpdateCommand from "src/shared/loom-state/commands/source-update-command";
import { type Source } from "src/shared/loom-state/types/loom-state";
import updateStateFromSources from "src/shared/loom-state/update-state-from-sources";

const HOOK_NAME = "useSource";

export const useSource = () => {
	const { app } = useAppMount();
	const { doCommand, loomState, setLoomState } = useLoomState();

	const { sources, columns } = loomState.model;

	const frontmatterKeyHash = JSON.stringify(
		columns.map((column) => column.frontmatterKey)
	);
	const sourcesHash = JSON.stringify(sources);

	const updateRowsFromSources = React.useCallback(
		(fromObsidianEvent = true) => {
			Logger.trace(HOOK_NAME, "updateRowsFromSources", "called");
			setLoomState((prevState) => {
				if (fromObsidianEvent) {
					if (Date.now() - prevState.time < 1000) {
						Logger.trace(
							HOOK_NAME,
							"updateRowsFromSource",
							"event ignored because it was called in the last 1000ms."
						);
						return prevState;
					}
				}
				const { sources, columns, rows } = prevState.state.model;
				const result = updateStateFromSources(
					app,
					sources,
					columns,
					rows.length
				);
				const { newRows, nextColumns } = result;
				const internalRows = rows.filter(
					(row) => row.sourceId === null
				);
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
					shouldSaveFrontmatter: true,
					time: Date.now(),
				};
			});
		},
		[app, setLoomState]
	);

	React.useEffect(() => {
		updateRowsFromSources(false);
	}, [sourcesHash, frontmatterKeyHash, updateRowsFromSources]);

	React.useEffect(() => {
		EventManager.getInstance().on("file-create", updateRowsFromSources);
		EventManager.getInstance().on(
			"file-frontmatter-change",
			updateRowsFromSources
		);
		EventManager.getInstance().on(
			"property-type-change",
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
				"property-type-change",
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
		Logger.trace("handleSourceAdd");
		doCommand(new SourceAddCommand(source));
	}

	function handleSourceDelete(id: string) {
		Logger.trace("handleSourceDelete", { id });
		doCommand(new SourceDeleteCommand(id));
	}

	function handleSourceUpdate(id: string, data: Partial<Source>) {
		Logger.trace("handleSourceUpdate", {
			id,
			data,
		});
		doCommand(new SourceUpdateCommand(id, data));
	}

	return {
		onSourceAdd: handleSourceAdd,
		onSourceDelete: handleSourceDelete,
		onSourceUpdate: handleSourceUpdate,
	};
};
