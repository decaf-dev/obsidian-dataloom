import { css } from "@emotion/react";
import { transparentInputStyle } from "src/react/loom-app/shared-styles";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function Input({ value, onChange }: Props) {
	return (
		<div
			css={css`
				background-color: var(--background-secondary);
				border-bottom: 1px solid var(--table-border-color);
				padding: var(--nlt-spacing--sm) var(--nlt-spacing--lg);
			`}
		>
			<input
				className="DataLoom__focusable"
				type="text"
				css={transparentInputStyle}
				autoFocus
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
