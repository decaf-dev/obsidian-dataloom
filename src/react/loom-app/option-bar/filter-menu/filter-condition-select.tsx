import Select from "src/react/shared/select";
import { FilterCondition } from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	options: FilterCondition[];
	value: FilterCondition;
	onChange: (id: string, value: FilterCondition) => void;
}

export default function FilterConditionSelect({
	id,
	value,
	options,
	onChange,
}: Props) {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
		}
	}

	function getDisplayNameForFilterCondition(type: FilterCondition) {
		switch (type) {
			case FilterCondition.IS:
				return "Is";
			case FilterCondition.IS_NOT:
				return "Is not";
			case FilterCondition.CONTAINS:
				return "Contains";
			case FilterCondition.DOES_NOT_CONTAIN:
				return "Does not contain";
			case FilterCondition.STARTS_WITH:
				return "Starts with";
			case FilterCondition.ENDS_WITH:
				return "Ends with";
			case FilterCondition.IS_EMPTY:
				return "Is empty";
			case FilterCondition.IS_NOT_EMPTY:
				return "Is not empty";
		}
	}

	return (
		<Select
			value={value}
			onKeyDown={handleKeyDown}
			onChange={(newValue) => onChange(id, newValue as FilterCondition)}
		>
			{options.map((option) => (
				<option key={option} value={option}>
					{getDisplayNameForFilterCondition(option)}
				</option>
			))}
		</Select>
	);
}
