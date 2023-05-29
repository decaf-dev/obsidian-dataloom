import { useInputSelection } from "src/shared/hooks";
import { isValidNumberInput } from "src/shared/validators";

import "./styles.css";
import React from "react";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function NumberCellEdit({ value, onChange }: Props) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const { setPreviousSelectionStart } = useInputSelection(inputRef, value);

	function handleChange(inputValue: string, setSelectionToLength = false) {
		if (!isValidNumberInput(inputValue)) return;

		//When we press the menu key, an extra character will be added
		//we need to update the selection to be after this character
		//Otherwise keep the selection where it was
		if (inputRef.current) {
			if (setSelectionToLength) {
				setPreviousSelectionStart(inputValue.length);
			} else if (inputRef.current.selectionStart) {
				setPreviousSelectionStart(inputRef.current.selectionStart);
			}
		}

		onChange(inputValue);
	}

	return (
		<div className="NLT__number-cell-edit">
			<input
				autoFocus
				type="text" //We use an input of type text so that the selection is available
				ref={inputRef}
				inputMode="numeric"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
			/>
		</div>
	);
}
