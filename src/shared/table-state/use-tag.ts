import { SetStateAction } from "react";
import { TableState } from "src/shared/table-state/types";
import { useLogger } from "../logger";
import { Color } from "../types";
import { tagAdd, tagAddCell, tagRemoveCell } from "./tag-state-operations";
import TagDeleteCommand from "../commands/tag-delete-command";
import { useTableState } from "./table-state-context";
import TagUpdateCommand from "../commands/tag-update-command";

export const useTag = (
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const { doCommand } = useTableState();
	const logFunc = useLogger();

	function handleAddTag(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		logFunc("handleAddTag", {
			cellId,
			columnId,
			rowId,
			markdown,
			color,
			isMultiTag,
		});
		onChange((prevState) =>
			tagAdd(
				prevState,
				cellId,
				columnId,
				rowId,
				markdown,
				color,
				isMultiTag
			)
		);
	}

	function handleAddCellToTag(
		cellId: string,
		rowId: string,
		tagId: string,
		isMultiTag: boolean
	) {
		logFunc("handleAddCellToTag", {
			cellId,
			rowId,
			tagId,
			isMultiTag,
		});
		onChange((prevState) =>
			tagAddCell(prevState, cellId, rowId, tagId, isMultiTag)
		);
	}

	function handleRemoveCellFromTag(
		cellId: string,
		rowId: string,
		tagId: string
	) {
		logFunc("handleRemoveCellFromTag", {
			cellId,
			rowId,
			tagId,
		});
		onChange((prevState) => tagRemoveCell(prevState, cellId, rowId, tagId));
	}

	function handleTagDeleteClick(tagId: string) {
		logFunc("handleTagDeleteClick", {
			tagId,
		});
		doCommand(new TagDeleteCommand(tagId));
	}

	function handleTagChangeColor(tagId: string, color: Color) {
		logFunc("handleTagChangeColor", {
			tagId,
			color,
		});
		doCommand(new TagUpdateCommand(tagId, "color", color));
	}

	return {
		handleAddCellToTag,
		handleAddTag,
		handleRemoveCellFromTag,
		handleTagChangeColor,
		handleTagDeleteClick,
	};
};
