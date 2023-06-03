import { css } from "@emotion/react";

interface Props {
	width?: string;
	height?: string;
	isVertical?: boolean;
}

export default function Divider({
	isVertical = false,
	width = "100%",
	height = "100%",
}: Props) {
	return (
		<hr
			css={css`
				margin: 0;
				width: ${!isVertical ? width : "unset"};
				height: ${isVertical === true ? height : "unset"};
				border-top: ${isVertical === false
					? "1px solid var(--hr-color)"
					: "unset"};
				border-left: ${isVertical === true
					? "1px var(--hr-color) solid"
					: "unset"};
			`}
		/>
	);
}
