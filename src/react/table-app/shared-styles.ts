import { css } from "@emotion/react";

export const selectStyle = css`
	&:focus {
		box-shadow: none !important;
		transition: none !important;
	}
`;

export const baseInputStyle = css`
	width: 100%;
	height: 100%;
	transition: none !important;
	font-size: var(--font-ui-medium) !important;
	box-shadow: none !important;
`;

const borderlessStyle = css`
	${baseInputStyle}
	border: 0 !important;
	border-radius: 0 !important;
`;

export const textAreaStyle = css`
	${borderlessStyle}
	overflow: hidden;
	padding: var(--nlt-cell-spacing-x) var(--nlt-cell-spacing-y);
	resize: none;

	&:focus {
		outline: 2px solid var(--background-modifier-border-focus);
		outline-offset: -2px;
	}
`;

export const numberInputStyle = css`
	${borderlessStyle}
	text-align: right;

	&:focus {
		outline: 2px solid var(--background-modifier-border-focus);
		outline-offset: -2px;
	}
`;

export const transparentInputStyle = css`
	${baseInputStyle}
	background-color: transparent !important;
	border: 0px !important;
	padding: 5px 0px;
`;

export const borderInputStyle = css`
	${baseInputStyle}
	border: 1px solid var(--table-border-color) !important;
	padding: 5px 10px;
	background-color: var(--background-secondary);
`;
