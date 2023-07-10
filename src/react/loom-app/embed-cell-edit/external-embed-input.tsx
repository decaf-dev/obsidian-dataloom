import React from "react";
import { useInputSelection } from "src/shared/hooks";
import { borderInputStyle } from "../shared-styles";
import { css } from "@emotion/react";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function ExternalEmbedInput({ value, onChange }: Props) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	useInputSelection(inputRef, value);
	return (
		<input
			autoFocus
			type="text"
			className="DataLoom__focusable"
			css={css`
				${borderInputStyle}
			`}
			ref={inputRef}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
