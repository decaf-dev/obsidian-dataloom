import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { MenuCloseRequest } from "src/shared/menu/types";
import { css } from "@emotion/react";
import { borderInputStyle } from "src/react/table-app/shared-styles";
import Switch from "src/react/shared/switch";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	value: string;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function EmbedCellEdit({
	menuCloseRequest,
	value,
	onChange,
	onMenuClose,
}: Props) {
	const [isExternal, setIsExternal] = React.useState(true);
	const [localValue, setLocalValue] = React.useState(value);
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

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const inputValue = e.target.value;
		setLocalValue(inputValue);
	}

	return (
		<div className="NLT__embed-cell-edit">
			<Padding width="100%" p="md">
				<Stack width="100%" isVertical spacing="lg">
					<Stack isVertical spacing="sm" width="100%">
						<label htmlFor="external-switch">External Link</label>
						<Switch
							id="external-switch"
							isChecked={isExternal}
							onToggle={(value) => setIsExternal(value)}
						/>
					</Stack>
					{isExternal && (
						<input
							autoFocus
							className="NLT__focusable"
							css={css`
								${borderInputStyle}
							`}
							ref={inputRef}
							value={localValue}
							onChange={handleInputChange}
						/>
					)}
				</Stack>
			</Padding>
		</div>
	);
}
