import { css } from "@emotion/react";
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
		<select
			css={css`
				max-width: 175px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			`}
			value={value}
			onChange={(e) => onChange(id, e.target.value)}
		>
			{columns.map((column) => (
				<option key={column.id} value={column.id}>
					{column.name}
				</option>
			))}
		</select>
	);
}
