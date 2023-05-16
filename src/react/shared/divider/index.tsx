import { css } from "@emotion/react";

interface Props {
	width?: string;
	height?: string;
	isVertical?: boolean;
}

export default function Divider({
	isVertical,
	width = "100%",
	height = "100%",
}: Props) {
	return (
		<hr
			css={css`
				margin: 0;
				width: ${!isVertical ? width : "unset"};
				height: ${isVertical === true ? height : "unset"};
				border-left: ${isVertical === true
					? "var(--hr-thickness) var(--hr-color) solid"
					: "unset"};
			`}
		/>
	);
}
