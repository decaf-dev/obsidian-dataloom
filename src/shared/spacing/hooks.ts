import { css } from "@emotion/react";

const wrapOverflow = css`
	overflow-wrap: break-word;
	overflow: hidden;
	white-space: normal;
`;

const hideOverflow = css`
	overflow: hidden;
	overflow-wrap: normal;
	white-space: nowrap;
`;

export const useOverflow = (shouldWrapOverflow: boolean) => {
	if (shouldWrapOverflow) return wrapOverflow;
	return hideOverflow;
};
