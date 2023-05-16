import { useFocusMenuInput, useInputSelection } from "src/shared/hooks";
import { isNumber } from "src/shared/validators";

import "./styles.css";
import { MINUS_REGEX } from "src/shared/regex";

interface Props {
	isMenuVisible: boolean;
	value: string;
	onChange: (value: string) => void;
}

export default function NumberCellEdit({
	isMenuVisible,
	value,
	onChange,
}: Props) {
	const inputRef = useFocusMenuInput(isMenuVisible, value, handleChange, {
		isNumeric: true,
	});
	const { setPreviousSelectionStart } = useInputSelection(inputRef, value);

	function handleChange(value: string) {
		if (!isNumber(value) && value !== "" && !value.match(MINUS_REGEX))
			return;
		if (inputRef.current) {
			setPreviousSelectionStart(
				inputRef.current.selectionStart || value.length
			);
		}
		onChange(value);
	}

	return (
		<div className="NLT__number-cell-edit">
			<input
				type="text" //We use an input of type text so that the selection is available
				ref={inputRef}
				inputMode="numeric"
				autoFocus
				value={value}
				onChange={(e) => handleChange(e.target.value)}
			/>
		</div>
	);
}
