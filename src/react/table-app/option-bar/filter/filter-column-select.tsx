import { css } from "@emotion/react";
import { ColumnWithMarkdown } from "../types";

interface Props {
	id: string;
	columns: ColumnWithMarkdown[];
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
			{columns.map((column) => {
				const { id, markdown } = column;
				return (
					<option key={id} value={id}>
						{markdown}
					</option>
				);
			})}
		</select>
	);
}
