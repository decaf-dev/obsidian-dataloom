import { css } from "@emotion/react";
import { ColumnWithMarkdown } from "../types";
import { selectStyle } from "src/react/table-app/shared-styles";

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
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
			//Stop propagation so the the menu doesn't close when pressing enter
			e.stopPropagation();
		}
	}

	return (
		<select
			tabIndex={0}
			className="Dashboards__focusable"
			css={css`
				${selectStyle}
				max-width: 175px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			`}
			value={value}
			onChange={(e) => onChange(id, e.target.value)}
			onKeyDown={handleKeyDown}
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
