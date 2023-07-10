import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { isNumber, isNumberInput } from "src/shared/match";
import { MenuCloseRequest } from "src/shared/menu/types";
import { numberInputStyle } from "src/react/table-app/shared-styles";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	value: string;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function CurrencyCellEdit({
	value,
	menuCloseRequest,
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
		<div className="Dashboards__currency-cell-edit">
			<input
				autoFocus
				css={numberInputStyle}
				ref={inputRef}
				type="text" //We use an input of type text so that the selection is available
				inputMode="numeric"
				value={localValue}
				onChange={(e) => handleChange(e.target.value)}
				onBlur={(e) => {
					e.target.classList.add("Dashboards__blur--cell");
				}}
			/>
		</div>
	);
}
