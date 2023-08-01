import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { isNumber, isNumberInput } from "src/shared/match";
import { MenuCloseRequest } from "src/shared/menu/types";
import { numberInputStyle } from "src/react/loom-app/shared-styles";

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
			<input
				autoFocus
				css={numberInputStyle}
				type="text" //We use an input of type text so that the selection is available
				ref={inputRef}
				inputMode="numeric"
				value={localValue}
				onChange={(e) => handleChange(e.target.value)}
				onBlur={(e) => {
					e.target.classList.add("dataloom-blur--cell");
				}}
			/>
		</div>
	);
}
