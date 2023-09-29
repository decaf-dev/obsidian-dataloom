import { useLogger } from "src/shared/logger";
import { Color, Tag } from "src/shared/loom-state/types/loom-state";
import TagDeleteCommand from "src/shared/loom-state/commands/tag-delete-command";
import { useLoomState } from "../../../loom-state-provider";
import TagUpdateCommand from "src/shared/loom-state/commands/tag-update-command";
import TagAddCommand from "src/shared/loom-state/commands/tag-add-command";
import TagCellRemoveCommand from "src/shared/loom-state/commands/tag-cell-remove-command";
import TagCellAddCommand from "src/shared/loom-state/commands/tag-cell-add-command";
import TagCellMultipleRemoveCommand from "src/shared/loom-state/commands/tag-cell-multiple-remove-command";

export const useTag = () => {
	const { doCommand } = useLoomState();
	const logFunc = useLogger();

	function handleTagAdd(
		cellId: string,
		columnId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		logFunc("handleTagAdd", {
			cellId,
			columnId,
			markdown,
			color,
			isMultiTag,
		});
		doCommand(
			new TagAddCommand(cellId, columnId, markdown, color, isMultiTag)
		);
	}

	function handleTagCellAdd(
		cellId: string,
		tagId: string,
		isMultiTag: boolean
	) {
		logFunc("handleTagCellAdd", {
			cellId,
			tagId,
			isMultiTag,
		});
		doCommand(new TagCellAddCommand(cellId, tagId, isMultiTag));
	}

	function handleTagCellRemove(cellId: string, tagId: string) {
		logFunc("handleTagCellRemove", {
			cellId,
			tagId,
		});
		doCommand(new TagCellRemoveCommand(cellId, tagId));
	}

	function handleTagChange(
		columnId: string,
		tagId: string,
		data: Partial<Tag>,
		isPartial = true
	) {
		logFunc("handleTagChange", {
			columnId,
			tagId,
			data,
		});
		doCommand(new TagUpdateCommand(columnId, tagId, data, isPartial));
	}

	function handleTagCellMultipleRemove(cellId: string, tagIds: string[]) {
		logFunc("handleTagCellMultipleRemove", {
			cellId,
			tagIds,
		});
		doCommand(new TagCellMultipleRemoveCommand(cellId, tagIds));
	}

	function handleTagDeleteClick(columnId: string, tagId: string) {
		logFunc("handleTagDeleteClick", {
			columnId,
			tagId,
		});
		doCommand(new TagDeleteCommand(columnId, tagId));
	}

	return {
		onTagCellAdd: handleTagCellAdd,
		onTagAdd: handleTagAdd,
		onTagCellRemove: handleTagCellRemove,
		onTagChange: handleTagChange,
		onTagCellMultipleRemove: handleTagCellMultipleRemove,
		onTagDeleteClick: handleTagDeleteClick,
	};
};
