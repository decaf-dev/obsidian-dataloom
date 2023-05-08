import { SetStateAction } from "react";
import { TableState } from "src/shared/table-state/types";
import { useLogger } from "../logger";
import { Color } from "../types";
import {
	tagAddCell,
	tagAddNew,
	tagDelete,
	tagRemoveCell,
	tagUpdateColor,
} from "./tag-state-operations";

export const useTag = (
	onChange: React.Dispatch<SetStateAction<TableState>>
) => {
	const logFunc = useLogger();

	function handleAddTag(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		canAddMultiple: boolean
	) {
		logFunc("handleAddTag", {
			cellId,
			columnId,
			rowId,
			markdown,
			color,
			canAddMultiple,
		});
		onChange((prevState) =>
			tagAddNew(
				prevState,
				cellId,
				columnId,
				rowId,
				markdown,
				color,
				canAddMultiple
			)
		);
	}

	function handleAddCellToTag(
		cellId: string,
		rowId: string,
		tagId: string,
		canAddMultiple: boolean
	) {
		logFunc("handleAddCellToTag", {
			cellId,
			rowId,
			tagId,
			canAddMultiple,
		});
		onChange((prevState) =>
			tagAddCell(prevState, cellId, rowId, tagId, canAddMultiple)
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
		onChange((prevState) => tagDelete(prevState, tagId));
	}

	function handleTagChangeColor(tagId: string, color: Color) {
		logFunc("handleTagChangeColor", {
			tagId,
			color,
		});
		onChange((prevState) => tagUpdateColor(prevState, tagId, color));
	}

	return {
		handleAddCellToTag,
		handleAddTag,
		handleRemoveCellFromTag,
		handleTagChangeColor,
		handleTagDeleteClick,
	};
};
