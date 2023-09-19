import { FilterOperator as FilterOperatorType } from "src/shared/loom-state/types/loom-state";
import Select from "src/react/shared/select";

interface Props {
	id: string;
	value: FilterOperatorType;
	onChange: (id: string, value: FilterOperatorType) => void;
}

export default function FilterOperator({ id, value, onChange }: Props) {
	return (
		<Select
			className="dataloom-filter-operator"
			value={value}
			onChange={(newValue) =>
				onChange(id, newValue as FilterOperatorType)
			}
		>
			<option value="or">Or</option>
			<option value="and">And</option>
		</Select>
	);
}
