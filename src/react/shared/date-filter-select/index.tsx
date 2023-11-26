import Select from "src/react/shared/select";
import { getDisplayNameForDateFilterOption } from "src/shared/loom-state/type-display-names";
import { DateFilterOption } from "src/shared/loom-state/types/loom-state";

interface Props {
	value: DateFilterOption;
	onChange: (value: DateFilterOption) => void;
}

export default function DateFilterSelect({ value, onChange }: Props) {
	return (
		<Select
			value={value}
			onChange={(value) => onChange(value as DateFilterOption)}
		>
			{Object.values(DateFilterOption).map((option) => (
				<option key={option} value={option}>
					{getDisplayNameForDateFilterOption(option)}
				</option>
			))}
		</Select>
	);
}
