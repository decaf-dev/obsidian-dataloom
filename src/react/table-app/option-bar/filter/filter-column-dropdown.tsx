import { ColumnFilter } from "../types";

interface Props {
	id: string;
	columns: ColumnFilter[];
	value: string;
	onChange: (id: string, columnId: string) => void;
}

export default function FilterColumnDropdown({
	id,
	columns,
	value,
	onChange,
}: Props) {
	return (
		<select value={value} onChange={(e) => onChange(id, e.target.value)}>
			{columns.map((column) => (
				<option key={column.id} value={column.id}>
					{column.name}
				</option>
			))}
		</select>
	);
}
