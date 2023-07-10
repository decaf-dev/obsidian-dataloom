import { useLogger } from "../logger";
import { Color } from "../types";
import TagDeleteCommand from "../commands/tag-delete-command";
import { useLoomState } from "./table-state-context";
import TagUpdateCommand from "../commands/tag-update-command";
import TagAddCommand from "../commands/tag-add-command";
import TagCellRemoveCommand from "../commands/tag-cell-remove-command";
import TagCellAddCommand from "../commands/tag-cell-add-command";
import TagCellMultipleRemoveCommand from "../commands/tag-cell-multiple-remove-command";

export const useTag = () => {
	const { doCommand } = useLoomState();
	const logFunc = useLogger();

	function handleTagAdd(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		logFunc("handleTagAdd", {
			cellId,
			columnId,
			rowId,
			markdown,
			color,
			isMultiTag,
		});
		doCommand(
			new TagAddCommand(
				cellId,
				columnId,
				rowId,
				markdown,
				color,
				isMultiTag
			)
		);
	}

	function handleTagCellAdd(
		cellId: string,
		rowId: string,
		tagId: string,
		isMultiTag: boolean
	) {
		logFunc("handleTagCellAdd", {
			cellId,
			rowId,
			tagId,
			isMultiTag,
		});
		doCommand(new TagCellAddCommand(cellId, rowId, tagId, isMultiTag));
	}

	function handleTagCellRemove(cellId: string, rowId: string, tagId: string) {
		logFunc("handleTagCellRemove", {
			cellId,
			rowId,
			tagId,
		});
		doCommand(new TagCellRemoveCommand(cellId, rowId, tagId));
	}

	function handleTagCellMultipleRemove(
		cellId: string,
		rowId: string,
		tagIds: string[]
	) {
		logFunc("handleTagCellMultipleRemove", {
			cellId,
			rowId,
			tagIds,
		});
		doCommand(new TagCellMultipleRemoveCommand(cellId, rowId, tagIds));
	}

	function handleTagDeleteClick(columnId: string, tagId: string) {
		logFunc("handleTagDeleteClick", {
			columnId,
			tagId,
		});
		doCommand(new TagDeleteCommand(columnId, tagId));
	}

	function handleTagColorChange(
		columnId: string,
		tagId: string,
		color: Color
	) {
		logFunc("handleTagColorChange", {
			columnId,
			tagId,
			color,
		});
		doCommand(new TagUpdateCommand(columnId, tagId, "color", color));
	}

	return {
		handleTagCellAdd,
		handleTagAdd,
		handleTagCellRemove,
		handleTagColorChange,
		handleTagCellMultipleRemove,
		handleTagDeleteClick,
	};
};
