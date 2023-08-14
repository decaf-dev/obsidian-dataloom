import React from "react";

import { usePlaceCursorAtEnd } from "src/shared/hooks";
import { isNumber, isNumberInput } from "src/shared/match";

import Input from "src/react/shared/input";
import { LoomMenuCloseRequest } from "../../shared/menu/types";

interface Props {
	closeRequest: LoomMenuCloseRequest | null;
	value: string;
	onChange: (value: string) => void;
	onClose: () => void;
}

export default function CurrencyCellEdit({
	value,
	closeRequest,
	onChange,
	onClose,
}: Props) {
	const initialValue = isNumber(value) ? value : "";
	const [localValue, setLocalValue] = React.useState(initialValue);
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	usePlaceCursorAtEnd(inputRef, localValue);

	React.useEffect(() => {
		if (closeRequest !== null) {
			if (localValue !== value) onChange(localValue);
			onClose();
		}
	}, [value, localValue, closeRequest, onClose, onChange]);

	function handleChange(inputValue: string) {
		if (!isNumberInput(inputValue)) return;

		setLocalValue(inputValue);
	}

	return (
		<div className="dataloom-currency-cell-edit">
			<Input
				ref={inputRef}
				//Set input mode so that the keyboard is numeric
				//but selection is still available
				focusOutline="default"
				inputMode="numeric"
				value={localValue}
				onChange={handleChange}
				onBlur={(e) => {
					e.target.classList.add("dataloom-blur--cell");
				}}
			/>
		</div>
	);
}
