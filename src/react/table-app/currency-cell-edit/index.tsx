import { useFocusMenuInput } from "src/shared/hooks";
import "./styles.css";

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

	return (
		<div className="NLT__currency-cell-edit">
			<input
				ref={inputRef}
				type="number"
				autoFocus
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
