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
	width?: string;
	height?: string;
}

export default function Stack({
	spacing = "md",
	justify = "center",
	align = "center",
	children,
	width = "unset",
	height = "unset",
	isVertical,
}: Props) {
	return (
		<div
			css={css`
				display: flex;
				flex-direction: ${isVertical ? "column" : "row"};
				align-items: ${align}
				justify-content: ${justify};
				${isVertical ? "row-gap" : "column-gap"}: ${getSpacing(spacing)};
				width: ${width};
				height: ${height};
			`}
		>
			{children}
		</div>
	);
}
