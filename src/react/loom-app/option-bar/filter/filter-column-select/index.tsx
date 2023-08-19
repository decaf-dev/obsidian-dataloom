import { ColumnWithMarkdown } from "../../types";
import Select from "src/react/shared/select";

interface Props {
	id: string;
	columns: ColumnWithMarkdown[];
	value: string;
	onChange: (id: string, columnId: string) => void;
}

export default function FilterColumnSelect({
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
		<Select
			className="dataloom-filter-column-select"
			value={value}
			onKeyDown={handleKeyDown}
			onChange={(newValue) => onChange(id, newValue)}
		>
			{columns.map((column) => {
				const { id, markdown } = column;
				return (
					<option key={id} value={id}>
						{markdown}
					</option>
				);
			})}
		</Select>
	);
}
