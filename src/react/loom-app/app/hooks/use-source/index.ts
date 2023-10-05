import { CellType, SourceType } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../../loom-state-provider";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";
import findDataFromSources from "src/shared/loom-state/find-data-from-sources";
import { useAppMount } from "src/react/loom-app/app-mount-provider";
import React, { useCallback } from "react";
import { FrontMatterType } from "./types";
import CellNotFoundError from "src/shared/error/cell-not-found-error";

export const useSource = () => {
	const logger = useLogger();
	const { app } = useAppMount();
	const { doCommand, setLoomState, loomState } = useLoomState();

	const [allFrontMatterKeys, setFrontMatterKeys] = React.useState(
		new Map<FrontMatterType, string[]>()
	);

	React.useEffect(() => {
		const { columns, rows } = loomState.model;
		setFrontMatterKeys((prevState) => {
			const newFrontmatterKeys = new Map(prevState);

			const sourceFileColumn = columns.find(
				(column) => column.type === CellType.SOURCE_FILE
			);
			if (sourceFileColumn) {
				rows.forEach((row) => {
					const { cells } = row;
					const cell = cells.find(
						(cell) => cell.columnId === sourceFileColumn.id
					);
					if (!cell)
						throw new CellNotFoundError({
							columnId: sourceFileColumn.id,
						});
					const { content } = cell;
					const frontmatter =
						app.metadataCache.getCache(content)?.frontmatter;
					if (frontmatter) {
						for (const key of Object.keys(frontmatter)) {
							const value = frontmatter[key];

							let type: FrontMatterType = "text";
							if (Array.isArray(value)) {
								type = "array";
							} else if (typeof value === "number") {
								type = "number";
							} else if (typeof value === "boolean") {
								type = "boolean";
							} else {
								type = "text";
							}

							const existingKeys =
								newFrontmatterKeys.get(type) ?? [];
							const newKeys = [...existingKeys, key];
							const newKeysSet = new Set(newKeys);
							newFrontmatterKeys.set(
								type,
								Array.from(newKeysSet)
							);
						}
					}
				});
			} else {
				newFrontmatterKeys.clear();
			}
			return newFrontmatterKeys;
		});
	}, [setFrontMatterKeys, loomState]);

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
