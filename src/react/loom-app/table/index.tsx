import React from "react";

import { TableComponents, TableVirtuoso, VirtuosoHandle } from "react-virtuoso";
import _ from "lodash";

import FooterCellContainer from "../footer-cell-container";
import HeaderCellContainer from "../header-cell-container";
import BodyRow from "./body-row";
import HeaderCell from "./header-cell";
import BodyCell from "./body-cell";
import FooterCell from "./footer-cell";
import NewColumnButton from "../new-column-button";
import RowOptions from "../row-options";
import BodyCellContainer from "../body-cell-container";

import { usePrevious } from "src/shared/hooks";
import {
	ColumnAddClickHandler,
	ColumnChangeHandler,
	ColumnDeleteClickHandler,
	ColumnReorderHandler,
	ColumnTypeClickHandler,
} from "../app/hooks/use-column/types";
import { RowReorderHandler } from "../app/hooks/use-row/types";

import {
	Column,
	Source,
	Row,
	Cell,
} from "src/shared/loom-state/types/loom-state";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
import { FrontMatterType } from "src/shared/deserialize-frontmatter/types";
import { cellTypeToFrontMatterKeyTypes } from "src/shared/deserialize-frontmatter/utils";
import { CellChangeHandler } from "../app/hooks/use-cell/types";
import {
	TagAddHandler,
	TagCellAddHandler,
	TagCellRemoveHandler,
	TagCellMultipleRemoveHandler,
	TagChangeHandler,
	TagDeleteHandler,
} from "../app/hooks/use-tag/types";

import "./styles.css";

interface Props {
	showCalculationRow: boolean;
	numFrozenColumns: number;
	frontmatterKeys: Map<FrontMatterType, string[]>;
	columns: Column[];
	resizingColumnId: string | null;
	sources: Source[];
	rows: Row[];
	onColumnDeleteClick: ColumnDeleteClickHandler;
	onColumnAddClick: ColumnAddClickHandler;
	onColumnTypeChange: ColumnTypeClickHandler;
	onFrozenColumnsChange: (value: number) => void;
	onColumnReorder: ColumnReorderHandler;
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
	onRowReorder: RowReorderHandler;
}

const Table = React.forwardRef<VirtuosoHandle, Props>(function Table(
	{
		sources,
		rows,
		frontmatterKeys,
		columns,
		numFrozenColumns,
		resizingColumnId,
		showCalculationRow,
		onColumnDeleteClick,
		onColumnAddClick,
		onColumnTypeChange,
		onFrozenColumnsChange,
		onColumnReorder,
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
		onRowReorder,
	},
	ref
) {
	const previousRowLength = usePrevious(rows.length);

	/**
	 * Scrolls to the bottom of the page when the "New Row" button is pressed
	 */
	React.useEffect(() => {
		if (previousRowLength === undefined) return;
		if (previousRowLength < rows.length)
			(
				ref as React.MutableRefObject<VirtuosoHandle | null>
			).current?.scrollToIndex(rows.length - 1);
	}, [ref, previousRowLength, rows.length]);

	React.useLayoutEffect(() => {
		//onTableRender();
	});

	const visibleColumns = columns.filter((column) => column.isVisible);

	return (
		<TableVirtuoso
			ref={ref}
			overscan={30}
			style={{
				width: "100%",
				height: "100%",
			}}
			totalCount={rows.length}
			components={{
				...Components,
				TableRow: ({ style, ...props }) => (
					<BodyRow
						{...props}
						style={style}
						onRowReorder={onRowReorder}
					/>
				),
			}}
			fixedHeaderContent={() => {
				const tableColumns = [null, ...visibleColumns, null];
				return (
					<div className="dataloom-row">
						{tableColumns.map((column, i) => {
							let content: React.ReactNode;
							let key: string;

							if (column === null) {
								key = `filler-${i}`;
								if (i === 0) {
									content = <></>;
								} else {
									content = (
										<NewColumnButton
											onClick={onColumnAddClick}
										/>
									);
								}
							} else {
								const { id, type } = column;
								const frontmatterTypes =
									cellTypeToFrontMatterKeyTypes(type);

								let columnKeys: string[] = [];
								frontmatterTypes.forEach((type) => {
									columnKeys = columnKeys.concat(
										frontmatterKeys.get(type) ?? []
									);
								});

								// Remove any frontmatter keys that are already in use
								columnKeys = columnKeys.filter((key) => {
									const columnWithKey = columns.find(
										(column) =>
											column.frontmatterKey?.value === key
									);
									if (!columnWithKey) return true;
									if (columnWithKey.id === id) return true;
									return false;
								});

								key = id;
								content = (
									<HeaderCellContainer
										key={id}
										index={i}
										column={column}
										frontmatterKeys={columnKeys}
										numColumns={columns.length}
										numSources={sources.length}
										numFrozenColumns={numFrozenColumns}
										resizingColumnId={resizingColumnId}
										onColumnChange={onColumnChange}
										onColumnDeleteClick={
											onColumnDeleteClick
										}
										onColumnTypeChange={onColumnTypeChange}
										onFrozenColumnsChange={
											onFrozenColumnsChange
										}
									/>
								);
							}

							return (
								<HeaderCell
									key={key}
									index={i}
									numFrozenColumns={numFrozenColumns}
									columnId={column?.id}
									content={content}
									isDraggable={
										i > 0 && i < tableColumns.length - 1
									}
									onColumnReorder={onColumnReorder}
								/>
							);
						})}
					</div>
				);
			}}
			fixedFooterContent={() => {
				if (!showCalculationRow) return undefined;

				const columns = [null, ...visibleColumns, null];
				return (
					<div className="dataloom-row">
						{columns.map((column, i) => {
							let content: React.ReactNode;
							let key: string;

							if (column === null) {
								key = `filler-${i}`;
								content = <></>;
							} else {
								const {
									id: columnId,
									type,
									currencyType,
									dateFormat,
									dateFormatSeparator,
									numberFormat,
									width,
									tags,
									calculationType,
								} = column;

								const columnCells: Cell[] = rows.map((row) => {
									const { id: rowId, cells } = row;
									const cell = cells.find(
										(cell) => cell.columnId === columnId
									);
									if (!cell)
										throw new CellNotFoundError({
											columnId,
											rowId,
										});
									return cell;
								});

								key = columnId;
								content = (
									<FooterCellContainer
										sources={sources}
										columnId={columnId}
										columnTags={tags}
										numberFormat={numberFormat}
										dateFormatSeparator={
											dateFormatSeparator
										}
										currencyType={currencyType}
										dateFormat={dateFormat}
										columnCells={columnCells}
										rows={rows}
										calculationType={calculationType}
										width={width}
										cellType={type}
										onColumnChange={onColumnChange}
									/>
								);
							}

							return (
								<FooterCell
									key={key}
									index={i}
									numFrozenColumns={numFrozenColumns}
									content={content}
								/>
							);
						})}
					</div>
				);
			}}
			itemContent={(index) => {
				const row = rows[index];
				const {
					id: rowId,
					lastEditedTime,
					creationTime,
					sourceId,
				} = row;
				const source =
					sources.find((source) => source.id === sourceId) ?? null;

				const columns = [null, ...visibleColumns, null];
				return columns.map((column, i) => {
					let content: React.ReactNode;
					let key: string;

					if (column === null) {
						key = `filler-${i}`;
						if (i === 0) {
							content = (
								<RowOptions
									source={source}
									rowId={rowId}
									onDeleteClick={onRowDeleteClick}
									onInsertAboveClick={onRowInsertAboveClick}
									onInsertBelowClick={onRowInsertBelowClick}
									onRowReorder={onRowReorder}
								/>
							);
						} else {
							content = <></>;
						}
					} else {
						const {
							id: columnId,
							width,
							type,
							shouldWrapOverflow,
							currencyType,
							includeTime,
							dateFormatSeparator,
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
							content: cellContent,
							dateTime,
							tagIds,
							isExternalLink,
						} = cell;

						const source =
							sources.find(
								(source) => source.id === row.sourceId
							) ?? null;

						key = column.id;
						content = (
							<BodyCellContainer
								key={cellId}
								cellId={cellId}
								frontmatterKey={frontmatterKey}
								isExternalLink={isExternalLink}
								verticalPadding={verticalPadding}
								includeTime={includeTime}
								dateFormatSeparator={dateFormatSeparator}
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
								content={cellContent}
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
						);
					}
					return (
						<BodyCell
							key={key}
							rowId={rowId}
							content={content}
							index={i}
							numFrozenColumns={numFrozenColumns}
						/>
					);
				});
			}}
		/>
	);
});

//Placing this outside of the table prevents the table from re-rendering
//when a menu changes
const Components: TableComponents = {
	Table: ({ ...props }) => {
		return <div className="dataloom-table" {...props} />;
	},
	//Don't apply styles because we want to apply sticky positioning
	//to the cells, not the header container
	TableHead: React.forwardRef(({ ...props }, ref) => {
		return (
			<div
				className="dataloom-header"
				{...props}
				style={{
					position: undefined,
					top: undefined,
					zIndex: undefined,
				}}
				ref={ref}
			/>
		);
	}),
	TableBody: React.forwardRef(({ style, ...props }, ref) => (
		<div className="dataloom-body" {...props} style={style} ref={ref} />
	)),
	TableFoot: React.forwardRef(({ ...props }, ref) => (
		<div
			className="dataloom-footer"
			{...props}
			//Don't apply styles because we want to apply sticky positioning
			//to the cells, not the footer container
			style={{
				position: undefined,
				bottom: undefined,
				zIndex: undefined,
			}}
			ref={ref}
		/>
	)),
	FillerRow: ({ height }) => (
		<div className="dataloom-row" style={{ height }} />
	),
};

const areEqual = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	return _.isEqual(prevProps, nextProps);
};

export default React.memo(Table, areEqual);
