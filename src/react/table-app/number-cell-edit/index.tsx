import { useFocusMenuInput, useInputSelection } from "src/shared/hooks";
import "./styles.css";
import { isNumber } from "src/shared/validators";

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
	const inputRef = useFocusMenuInput(isMenuVisible, value, onChange, {
		isNumeric: true,
	});
	useInputSelection(isMenuVisible, inputRef, value.length);

	function handleChange(value: string) {
		if (!isNumber(value)) return;
		onChange(value);
	}

	return (
		<div className="NLT__number-cell-edit">
			<input
				type="text"
				ref={inputRef}
				inputMode="numeric"
				autoFocus
				value={value}
				onChange={(e) => handleChange(e.target.value)}
			/>
		</div>
	);
}
