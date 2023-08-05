import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { isNumber, isNumberInput } from "src/shared/match";
import { MenuCloseRequest } from "src/shared/menu/types";

import Input from "src/react/shared/input";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	value: string;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function NumberCellEdit({
	menuCloseRequest,
	value,
	onChange,
	onMenuClose,
}: Props) {
	const initialValue = isNumber(value) ? value : "";
	const [localValue, setLocalValue] = React.useState(initialValue);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	useInputSelection(inputRef, localValue);

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			if (localValue !== value) onChange(localValue);
			onMenuClose();
		}
	}, [
		value,
		localValue,
		hasCloseRequestTimeChanged,
		menuCloseRequest,
		onMenuClose,
		onChange,
	]);

	function handleChange(inputValue: string) {
		if (!isNumberInput(inputValue)) return;

		setLocalValue(inputValue);
	}

	return (
		<div className="dataloom-number-cell-edit">
			<Input
				//Set input mode so that the keyboard is numeric
				//but selection is still available
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
