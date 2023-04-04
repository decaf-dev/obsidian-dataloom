import {
	CHECKBOX_MARKDOWN_CHECKED,
	CHECKBOX_MARKDOWN_UNCHECKED,
} from "src/services/tableState/constants";
import { isCheckboxChecked } from "src/services/string/validators";
import "./styles.css";

interface Props {
	value: string;
	onCheckboxChange: (value: string) => void;
}

export default function CheckboxCell({ value, onCheckboxChange }: Props) {
	const isChecked = isCheckboxChecked(value);

	function handleClick() {
		if (isChecked) {
			onCheckboxChange(CHECKBOX_MARKDOWN_UNCHECKED);
		} else {
			onCheckboxChange(CHECKBOX_MARKDOWN_CHECKED);
		}
	}

	return (
		<div className="NLT__checkbox-cell">
			<input
				className="task-list-item-checkbox"
				type="checkbox"
				checked={isChecked}
				onChange={() => {}}
				onClick={handleClick}
			/>
		</div>
	);
}
