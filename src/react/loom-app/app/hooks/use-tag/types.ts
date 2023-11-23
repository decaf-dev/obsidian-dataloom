import { Color, Tag } from "src/shared/loom-state/types/loom-state";

export type TagAddHandler = (
	cellId: string,
	columnId: string,
	markdown: string,
	color: Color
) => void;

export type TagCellAddHandler = (cellId: string, tagId: string) => void;

export type TagCellRemoveHandler = (cellId: string, tagId: string) => void;

export type TagCellMultipleRemoveHandler = (
	cellId: string,
	tagIds: string[]
) => void;

export type TagDeleteHandler = (columnId: string, tagId: string) => void;

export type TagChangeHandler = (
	columnId: string,
	tagId: string,
	data: Partial<Tag>,
	isPartial?: boolean
) => void;
