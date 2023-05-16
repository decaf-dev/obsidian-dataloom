import { useFocusMenuInput } from "src/shared/hooks";
import "./styles.css";
import { isNumber } from "src/shared/validators";
import { MINUS_REGEX } from "src/shared/regex";
interface Props {
	isMenuVisible: boolean;
	value: string;
	onChange: (value: string) => void;
}

export default function CurrencyCellEdit({
	isMenuVisible,
	value,
	onChange,
}: Props) {
	const inputRef = useFocusMenuInput(isMenuVisible, value, onChange);

	function handleChange(value: string) {
		if (!isNumber(value) && value !== "" && !value.match(MINUS_REGEX))
			return;
		onChange(value);
	}

	return (
		<div className="NLT__currency-cell-edit">
			<input
				ref={inputRef}
				type="text"
				inputMode="numeric"
				autoFocus
				value={value}
				onChange={(e) => handleChange(e.target.value)}
			/>
		</div>
	);
}
