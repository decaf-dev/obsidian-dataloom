import { SourceType } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../../loom-state-provider";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";
import findDataFromSources from "src/shared/loom-state/find-data-from-sources";
import { useAppMount } from "src/react/loom-app/app-mount-provider";
import React, { useCallback } from "react";
import { FrontMatterType } from "../../../../../shared/deserialize-frontmatter/types";
import { deserializeFrontmatterKeys } from "src/shared/deserialize-frontmatter";

export const useSource = () => {
	const logger = useLogger();
	const { app } = useAppMount();
	const { doCommand, setLoomState, loomState } = useLoomState();

	const [allFrontMatterKeys, setFrontMatterKeys] = React.useState(
		new Map<FrontMatterType, string[]>()
	);

	React.useEffect(() => {
		const { columns, rows } = loomState.model;
		setFrontMatterKeys(() =>
			deserializeFrontmatterKeys(app, columns, rows)
		);
	}, [setFrontMatterKeys, loomState, app]);

	function handleSourceAdd(type: SourceType, name: string) {
		logger("handleSourceAdd");
		doCommand(new SourceAddCommand(type, name));
	}

	function handleSourceDelete(id: string) {
		logger("handleSourceDelete", { id });
		doCommand(new SourceDeleteCommand(id));
	}

	const handleUpdateRowsFromSources = useCallback(() => {
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
		allFrontMatterKeys,
		onSourceAdd: handleSourceAdd,
		onSourceDelete: handleSourceDelete,
		onUpdateRowsFromSources: handleUpdateRowsFromSources,
	};
};
