import { css } from "@emotion/react";
import { AlignItems, JustifyContent } from "src/shared/render/types";
import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

interface Props {
	spacing?: SpacingSize;
	children: React.ReactNode;
	justify?: JustifyContent;
	align?: AlignItems;
	isHorizontal?: boolean;
	grow?: boolean;
	width?: string;
	height?: string;
	minHeight?: string;
}

export default function Stack({
	spacing = "md",
	justify,
	align,
	grow,
	children,
	width = "unset",
	height = "unset",
	minHeight = "unset",
	isHorizontal = false,
}: Props) {
	let justifyContent = justify;
	if (justifyContent === undefined) {
		if (!isHorizontal) justifyContent = "center";
		else justifyContent = "flex-start";
	}
	let alignItems = align;
	if (alignItems === undefined) {
		if (isHorizontal) alignItems = "center";
		else alignItems = "flex-start";
	}
	return (
		<div
			css={css`
				display: flex;
				flex-direction: ${isHorizontal ? "row" : "column"};
				flex-grow: ${grow ? 1 : 0};
				justify-content: ${justifyContent};
				align-items: ${alignItems};
				${isHorizontal ? "column-gap" : "row-gap"}: ${getSpacing(
					spacing
				)};
				width: ${width};
				height: ${height};
				min-height: ${minHeight};
			`}
		>
			{children}
		</div>
	);
}
