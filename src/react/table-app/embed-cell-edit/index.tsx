import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { useOverflow } from "src/shared/spacing/hooks";
import { MenuCloseRequest } from "src/shared/menu/types";
import { css } from "@emotion/react";

const textAreaStyle = css`
	width: 100%;
	height: max-content;
	border: 0 !important;
	overflow: hidden;
	padding: var(--nlt-cell-spacing-x) var(--nlt-cell-spacing-y);
	resize: none;
	font-size: var(--font-ui-medium) !important;
`;

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
	const { setPreviousSelectionStart, previousSelectionStart } =
		useInputSelection(inputRef, localValue);

	const previousValue = React.useRef("");

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			onChange(localValue);
			onMenuClose();
		}
	}, [
		localValue,
		hasCloseRequestTimeChanged,
		menuCloseRequest,
		onMenuClose,
		onChange,
	]);

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const inputValue = e.target.value;
		let newValue = inputValue;

		if (inputRef.current) {
			const inputEl = inputRef.current;

			if (inputEl.selectionStart)
				setPreviousSelectionStart(inputEl.selectionStart);
		}

		previousValue.current = newValue;
		setLocalValue(newValue);
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
			/>
		</div>
	);
}
