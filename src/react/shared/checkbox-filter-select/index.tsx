import Select from "../select";

interface Props {
	value: boolean;
	onChange: (value: boolean) => void;
}

export default function CheckboxFilterSelect({ value, onChange }: Props) {
	function handleChange(value: string) {
		if (value === "true") {
			onChange(true);
			return;
		}
		onChange(false);
	}

	return (
		<Select value={value ? "true" : "false"} onChange={handleChange}>
			<option value="false">Unchecked</option>
			<option value="true">Checked</option>
		</Select>
	);
}
