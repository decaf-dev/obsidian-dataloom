import { Color } from "src/shared/loom-state/types/loom-state";

export type TagAddHandler = (
	cellId: string,
	columnId: string,
	markdown: string,
	color: Color,
	isMultiTag: boolean
) => void;

export type TagCellAddHandler = (
	cellId: string,
	tagId: string,
	isMultiTag: boolean
) => void;

export type TagCellRemoveHandler = (cellId: string, tagId: string) => void;

export type TagCellMultipleRemoveHandler = (
	cellId: string,
	tagIds: string[]
) => void;

export type TagDeleteHandler = (columnId: string, tagId: string) => void;

//TODO change to TagChangeHandler
export type TagColorChangeHandler = (
	columnId: string,
	tagId: string,
	color: Color
) => void;

export type TagContentChangeHandler = (
	columnId: string,
	tagId: string,
	content: string
) => void;
