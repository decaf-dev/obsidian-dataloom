import { CellType, Column, HeaderCell } from "src/shared/table-state/types";
import { CellNotFoundError } from "src/shared/table-state/table-error";
import Stack from "../shared/stack";

interface Props {
	columns: Column[];
	headerCells: HeaderCell[];
	value: string;
	onChange: (value: string) => void;
}

export default function ColumnSelect({
	columns,
	headerCells,
	value,
	onChange,
}: Props) {
	return (
		<Stack isVertical>
			<label htmlFor="column-select">Column</label>
			<select
				id="column-select"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="">Select column</option>
				{columns
					.filter((column) => column.type == CellType.TEXT)
					.map((column) => {
						const cell = headerCells.find(
							(cell) => cell.columnId === column.id
						);
						if (!cell) throw new CellNotFoundError();
						return (
							<option key={column.id} value={column.id}>
								{cell.markdown}
							</option>
						);
					})}
			</select>
		</Stack>
	);
}
