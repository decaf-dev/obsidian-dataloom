import { css } from "@emotion/react";

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
	padding: 5px;
`;

export const borderInputStyle = css`
	${baseInputStyle}
	border: 1px solid var(--table-border-color) !important;
	padding: 5px 10px;
	background-color: var(--background-secondary);
`;
