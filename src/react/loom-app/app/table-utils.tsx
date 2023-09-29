import { Column } from "src/shared/loom-state/types/loom-state";
import HeaderCellContainer from "../header-cell-container";
import NewColumnButton from "../new-column-button";
import {
	ColumnAddClickHandler,
	ColumnChangeHandler,
	ColumnDeleteClickHandler,
	ColumnTypeClickHandler,
} from "./hooks/use-column/types";
import { HeaderTableRow } from "../table/types";

interface Props {
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
}: Props): HeaderTableRow => {
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
