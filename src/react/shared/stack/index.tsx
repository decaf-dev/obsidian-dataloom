import { css } from "@emotion/react";
import { AlignItems, JustifyContent } from "src/shared/renderTypes";
import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

interface Props {
	spacing?: SpacingSize;
	children: React.ReactNode;
	justify?: JustifyContent;
	align?: AlignItems;
	isVertical?: boolean;
	grow?: boolean;
	width?: string;
	height?: string;
}

export default function Stack({
	spacing = "md",
	justify,
	align,
	grow,
	children,
	width = "unset",
	height = "unset",
	isVertical,
}: Props) {
	let justifyContent = justify;
	if (justifyContent === undefined) {
		if (isVertical) justifyContent = "center";
		else justifyContent = "flex-start";
	}
	let alignItems = align;
	if (alignItems === undefined) {
		if (!isVertical) alignItems = "center";
		else alignItems = "flex-start";
	}
	return (
		<div
			css={css`
				display: flex;
				flex-direction: ${isVertical ? "column" : "row"};
				flex-grow: ${grow ? 1 : 0};
				justify-content: ${justifyContent};
				align-items: ${alignItems};
				${isVertical ? "row-gap" : "column-gap"}: ${getSpacing(
					spacing
				)};
				width: ${width};
				height: ${height};
			`}
		>
			{children}
		</div>
	);
}
