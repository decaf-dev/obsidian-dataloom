import { Column, Row } from "src/shared/loom-state/types/loom-state";
import { BodyTableRow } from "../table/types";
import BodyCellContainer from "../body-cell-container";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import RowOptions from "../row-options";
import { ColumnChangeHandler } from "./hooks/use-column/types";
import {
	TagAddHandler,
	TagCellAddHandler,
	TagCellMultipleRemoveHandler,
	TagCellRemoveHandler,
	TagColorChangeHandler,
	TagContentChangeHandler,
	TagDeleteHandler,
} from "./hooks/use-tag/types";
import { CellChangeHandler } from "./hooks/use-cell/types";

interface Props {
	firstColumnId: string;
	lastColumnId: string;
	visibleColumns: Column[];
	rows: Row[];
	onRowDeleteClick: (rowId: string) => void;
	onRowInsertAboveClick: (rowId: string) => void;
	onRowInsertBelowClick: (rowId: string) => void;
	onColumnChange: ColumnChangeHandler;
	onCellChange: CellChangeHandler;
	onTagAdd: TagAddHandler;
	onTagCellAdd: TagCellAddHandler;
	onTagCellRemove: TagCellRemoveHandler;
	onTagCellMultipleRemove: TagCellMultipleRemoveHandler;
	onTagContentChange: TagContentChangeHandler;
	onTagDeleteClick: TagDeleteHandler;
	onTagColorChange: TagColorChangeHandler;
}

export const getBodyRows = ({
	firstColumnId,
	lastColumnId,
	visibleColumns,
	rows,
	onRowDeleteClick,
	onRowInsertAboveClick,
	onRowInsertBelowClick,
	onColumnChange,
	onCellChange,
	onTagAdd,
	onTagCellAdd,
	onTagCellRemove,
	onTagCellMultipleRemove,
	onTagContentChange,
	onTagDeleteClick,
	onTagColorChange,
}: Props): BodyTableRow[] => {
	return rows.map((row) => {
		const { id: rowId, lastEditedTime, creationTime } = row;
		return {
			id: rowId,
			cells: [
				{
					id: firstColumnId,
					content: (
						<RowOptions
							rowId={rowId}
							onDeleteClick={onRowDeleteClick}
							onInsertAboveClick={onRowInsertAboveClick}
							onInsertBelowClick={onRowInsertBelowClick}
						/>
					),
				},
				...visibleColumns.map((column) => {
					const {
						id: columnId,
						width,
						type,
						shouldWrapOverflow,
						currencyType,
						numberPrefix,
						numberSeparator,
						numberFormat,
						numberSuffix,
						dateFormat,
						tags,
						verticalPadding,
						horizontalPadding,
						aspectRatio,
					} = column;

					const cell = row.cells.find(
						(cell) => cell.columnId === columnId
					);
					if (!cell)
						throw new CellNotFoundError({
							columnId,
							rowId,
						});

					const {
						id: cellId,
						content,
						dateTime,
						tagIds,
						isExternalLink,
					} = cell;

					return {
						id: cellId,
						content: (
							<BodyCellContainer
								key={cellId}
								cellId={cellId}
								isExternalLink={isExternalLink}
								verticalPadding={verticalPadding}
								horizontalPadding={horizontalPadding}
								aspectRatio={aspectRatio}
								columnTags={tags}
								cellTagIds={tagIds}
								columnId={columnId}
								numberFormat={numberFormat}
								rowCreationTime={creationTime}
								dateFormat={dateFormat}
								currencyType={currencyType}
								numberPrefix={numberPrefix}
								numberSuffix={numberSuffix}
								numberSeparator={numberSeparator}
								rowLastEditedTime={lastEditedTime}
								dateTime={dateTime}
								content={content}
								columnType={type}
								shouldWrapOverflow={shouldWrapOverflow}
								width={width}
								onTagClick={onTagCellAdd}
								onTagRemoveClick={onTagCellRemove}
								onTagMultipleRemove={onTagCellMultipleRemove}
								onCellChange={onCellChange}
								onTagColorChange={onTagColorChange}
								onTagDeleteClick={onTagDeleteClick}
								onTagAdd={onTagAdd}
								onColumnChange={onColumnChange}
								onTagContentChange={onTagContentChange}
							/>
						),
					};
				}),
				{
					id: lastColumnId,
					content: <></>,
				},
			],
		};
	});
};
