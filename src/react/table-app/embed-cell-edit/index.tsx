import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { useOverflow } from "src/shared/spacing/hooks";
import { MenuCloseRequest } from "src/shared/menu/types";
import { css } from "@emotion/react";
import { textAreaStyle } from "src/react/table-app/shared-styles";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	value: string;
	shouldWrapOverflow: boolean;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function EmbedCellEdit({
	shouldWrapOverflow,
	menuCloseRequest,
	value,
	onChange,
	onMenuClose,
}: Props) {
	const [localValue, setLocalValue] = React.useState(value);
	const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

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

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const inputValue = e.target.value;
		setLocalValue(inputValue);
	}

	const overflowStyle = useOverflow(shouldWrapOverflow);

	return (
		<div
			className="NLT__embed-cell-edit"
			css={css`
				width: 100%;
				height: 100%;
			`}
		>
			<textarea
				autoFocus
				css={css`
					${textAreaStyle}
					${overflowStyle}
				`}
				ref={inputRef}
				value={localValue}
				onChange={handleTextareaChange}
				onBlur={(e) => {
					e.target.classList.add("NLT__blur--cell");
				}}
			/>
		</div>
	);
}
