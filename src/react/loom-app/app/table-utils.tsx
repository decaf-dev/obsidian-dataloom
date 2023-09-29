import { Cell, Column, Row } from "src/shared/loom-state/types/loom-state";
import HeaderCellContainer from "../header-cell-container";
import NewColumnButton from "../new-column-button";
import {
	ColumnAddClickHandler,
	ColumnChangeHandler,
	ColumnDeleteClickHandler,
	ColumnTypeClickHandler,
} from "./hooks/use-column/types";
import { HeaderTableRow, TableRow } from "../table/types";
import FooterCellContainer from "../footer-cell-container";
import CellNotFoundError from "src/shared/error/cell-not-found-error";

interface GetHeaderRowProps {
	firstColumnId: string;
	lastColumnId: string;
	visibleColumns: Column[];
	numColumns: number;
	numFrozenColumns: number;
	resizingColumnId: string | null;
	onColumnChange: ColumnChangeHandler;
	onColumnDeleteClick: ColumnDeleteClickHandler;
	onColumnAddClick: ColumnAddClickHandler;
	onColumnTypeChange: ColumnTypeClickHandler;
	onFrozenColumnsChange: (value: number) => void;
}

export const getHeaderRow = ({
	firstColumnId,
	lastColumnId,
	visibleColumns,
	numColumns,
	numFrozenColumns,
	resizingColumnId,
	onColumnChange,
	onColumnDeleteClick,
	onColumnAddClick,
	onColumnTypeChange,
	onFrozenColumnsChange,
}: GetHeaderRowProps): HeaderTableRow => {
	return {
		cells: [
			{
				columnId: firstColumnId,
				content: <div className="dataloom-cell--left-corner" />,
			},
			...visibleColumns.map((column, i) => {
				const { id } = column;
				return {
					columnId: id,
					content: (
						<HeaderCellContainer
							key={id}
							index={i}
							column={column}
							numColumns={numColumns}
							numFrozenColumns={numFrozenColumns}
							resizingColumnId={resizingColumnId}
							onColumnChange={onColumnChange}
							onColumnDeleteClick={onColumnDeleteClick}
							onColumnTypeChange={onColumnTypeChange}
							onFrozenColumnsChange={onFrozenColumnsChange}
						/>
					),
				};
			}),
			{
				columnId: lastColumnId,
				content: <NewColumnButton onClick={onColumnAddClick} />,
			},
		],
	};
};

interface GetFooterRowProps {
	showCalculationRow: boolean;
	firstColumnId: string;
	lastColumnId: string;
	visibleColumns: Column[];
	rows: Row[];
	onColumnChange: ColumnChangeHandler;
}

export const getFooterRow = ({
	showCalculationRow,
	firstColumnId,
	lastColumnId,
	visibleColumns,
	rows,
	onColumnChange,
}: GetFooterRowProps): TableRow | undefined => {
	if (!showCalculationRow) return undefined;
	return {
		cells: [
			{
				id: firstColumnId,
				content: <></>,
			},
			...visibleColumns.map((column) => {
				const {
					id: columnId,
					type,
					currencyType,
					dateFormat,
					numberFormat,
					width,
					tags,
					calculationType,
				} = column;

				const columnCells: Cell[] = rows.map((row) => {
					const { cells } = row;
					const cell = cells.find(
						(cell) => cell.columnId === columnId
					);
					if (!cell)
						throw new CellNotFoundError({
							columnId,
							rowId: row.id,
						});
					return cell;
				});

				return {
					id: columnId,
					content: (
						<FooterCellContainer
							columnId={columnId}
							columnTags={tags}
							numberFormat={numberFormat}
							currencyType={currencyType}
							dateFormat={dateFormat}
							columnCells={columnCells}
							rows={rows}
							calculationType={calculationType}
							width={width}
							cellType={type}
							onColumnChange={onColumnChange}
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
};
