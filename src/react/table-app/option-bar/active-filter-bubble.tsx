import { css } from "@emotion/react";

interface Props {
	numActive: number;
}

export default function ActiveFilterBubble({ numActive }: Props) {
	if (numActive === 0) return <></>;
	return (
		<div
			css={css`
				border-radius: 8px;
				padding: 2px 6px;
				color: var(--text-on-accent);
				border: 1px solid var(--background-modifier-border);
				background-color: var(--color-accent);
			`}
		>
			{numActive} active filter
		</div>
	);
}
