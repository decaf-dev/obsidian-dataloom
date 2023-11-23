import { useLogger } from "src/shared/logger";
import { Color, Tag } from "src/shared/loom-state/types/loom-state";
import TagDeleteCommand from "src/shared/loom-state/commands/tag-delete-command";
import { useLoomState } from "../../../loom-state-provider";
import TagUpdateCommand from "src/shared/loom-state/commands/tag-update-command";
import TagAddCommand from "src/shared/loom-state/commands/tag-add-command";
import TagCellRemoveCommand from "src/shared/loom-state/commands/tag-cell-remove-command";
import TagCellAddCommand from "src/shared/loom-state/commands/tag-cell-add-command";
import TagCellMultipleRemoveCommand from "src/shared/loom-state/commands/tag-cell-multiple-remove-command";
import React from "react";

export const useTag = () => {
	const { doCommand } = useLoomState();
	const logger = useLogger();

	const handleTagAdd = React.useCallback(
		(cellId: string, columnId: string, markdown: string, color: Color) => {
			logger("handleTagAdd", {
				cellId,
				columnId,
				markdown,
				color,
			});
			doCommand(new TagAddCommand(cellId, columnId, markdown, color));
		},
		[doCommand, logger]
	);

	const handleTagCellAdd = React.useCallback(
		(cellId: string, tagId: string) => {
			logger("handleTagCellAdd", {
				cellId,
				tagId,
			});
			doCommand(new TagCellAddCommand(cellId, tagId));
		},
		[doCommand, logger]
	);

	const handleTagCellRemove = React.useCallback(
		(cellId: string, tagId: string) => {
			logger("handleTagCellRemove", {
				cellId,
				tagId,
			});
			doCommand(new TagCellRemoveCommand(cellId, tagId));
		},
		[doCommand, logger]
	);

	const handleTagChange = React.useCallback(
		(
			columnId: string,
			tagId: string,
			data: Partial<Tag>,
			isPartial = true
		) => {
			logger("handleTagChange", {
				columnId,
				tagId,
				data,
			});
			doCommand(new TagUpdateCommand(columnId, tagId, data, isPartial));
		},
		[doCommand, logger]
	);

	const handleTagCellMultipleRemove = React.useCallback(
		(cellId: string, tagIds: string[]) => {
			logger("handleTagCellMultipleRemove", {
				cellId,
				tagIds,
			});
			doCommand(new TagCellMultipleRemoveCommand(cellId, tagIds));
		},
		[doCommand, logger]
	);

	const handleTagDeleteClick = React.useCallback(
		(columnId: string, tagId: string) => {
			logger("handleTagDeleteClick", {
				columnId,
				tagId,
			});
			doCommand(new TagDeleteCommand(columnId, tagId));
		},
		[doCommand, logger]
	);

	return {
		onTagCellAdd: handleTagCellAdd,
		onTagAdd: handleTagAdd,
		onTagCellRemove: handleTagCellRemove,
		onTagChange: handleTagChange,
		onTagCellMultipleRemove: handleTagCellMultipleRemove,
		onTagDeleteClick: handleTagDeleteClick,
	};
};
