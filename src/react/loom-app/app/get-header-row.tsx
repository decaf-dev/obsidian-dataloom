import { Column } from "src/shared/loom-state/types/loom-state";
import HeaderCellContainer from "../header-cell-container";
import NewColumnButton from "../new-column-button";
import {
	ColumnAddClickHandler,
	ColumnChangeHandler,
	ColumnDeleteClickHandler,
	ColumnTypeClickHandler,
} from "./hooks/use-column/types";
import { TableRow } from "../table/types";

interface Props {
	firstColumnId: string;
	lastColumnId: string;
	visibleColumns: Column[];
	numColumns: number;
	numSources: number;
	numFrozenColumns: number;
	resizingColumnId: string | null;
	onColumnChange: ColumnChangeHandler;
	onColumnDeleteClick: ColumnDeleteClickHandler;
	onColumnAddClick: ColumnAddClickHandler;
	onColumnTypeChange: ColumnTypeClickHandler;
	onFrozenColumnsChange: (value: number) => void;
}

export default function getHeaderRow({
	firstColumnId,
	lastColumnId,
	visibleColumns,
	numColumns,
	numSources,
	numFrozenColumns,
	resizingColumnId,
	onColumnChange,
	onColumnDeleteClick,
	onColumnAddClick,
	onColumnTypeChange,
	onFrozenColumnsChange,
}: Props): TableRow {
	return {
		id: "header-row",
		cells: [
			{
				id: firstColumnId,
				content: <div className="dataloom-cell--left-corner" />,
			},
			...visibleColumns.map((column, i) => {
				const { id } = column;
				return {
					id,
					content: (
						<HeaderCellContainer
							key={id}
							index={i}
							column={column}
							numColumns={numColumns}
							numSources={numSources}
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
				id: lastColumnId,
				content: <NewColumnButton onClick={onColumnAddClick} />,
			},
		],
	};
}
