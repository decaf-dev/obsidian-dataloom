import { Column, Row, Source } from "src/shared/loom-state/types/loom-state";
import { TableRow } from "../table/types";
import BodyCellContainer from "../body-cell-container";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import RowOptions from "../row-options";
import { ColumnChangeHandler } from "./hooks/use-column/types";
import {
	TagAddHandler,
	TagCellAddHandler,
	TagCellMultipleRemoveHandler,
	TagCellRemoveHandler,
	TagChangeHandler,
	TagDeleteHandler,
} from "./hooks/use-tag/types";
import { CellChangeHandler } from "./hooks/use-cell/types";
import { App } from "obsidian";

interface Props {
	app: App;
	sources: Source[];
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
	onTagChange: TagChangeHandler;
	onTagDeleteClick: TagDeleteHandler;
}

export default function getBodyRows({
	sources,
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
	onTagChange,
	onTagDeleteClick,
}: Omit<Props, "app">): TableRow[] {
	return rows.map((row) => {
		const { id: rowId, lastEditedTime, creationTime, sourceId } = row;
		const source = sources.find((source) => source.id === sourceId) ?? null;
		return {
			id: rowId,
			cells: [
				{
					id: firstColumnId,
					content: (
						<RowOptions
							source={source}
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
						frontmatterKey,
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

					const source =
						sources.find((source) => source.id === row.sourceId) ??
						null;

					return {
						id: cellId,
						content: (
							<BodyCellContainer
								key={cellId}
								cellId={cellId}
								frontmatterKey={frontmatterKey}
								isExternalLink={isExternalLink}
								verticalPadding={verticalPadding}
								horizontalPadding={horizontalPadding}
								aspectRatio={aspectRatio}
								columnTags={tags}
								cellTagIds={tagIds}
								columnId={columnId}
								source={source}
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
								onTagDeleteClick={onTagDeleteClick}
								onTagAdd={onTagAdd}
								onColumnChange={onColumnChange}
								onTagChange={onTagChange}
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
}
