import { useFocusInput } from "src/shared/hooks";
import "./styles.css";

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
	const inputRef = useFocusInput(isMenuVisible);

	return (
		<div className="NLT__number-cell-edit">
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
