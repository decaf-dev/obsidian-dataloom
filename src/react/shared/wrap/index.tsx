import { css } from "@emotion/react";
import { AlignItems, JustifyContent } from "src/shared/renderTypes";
import { getDynamicSize } from "src/shared/renderUtils";
import { getSpacing } from "src/shared/spacing";
import { DynamicSize, SpacingSize } from "src/shared/spacing/types";

interface Props {
	justify?: DynamicSize<JustifyContent> | JustifyContent;
	align?: AlignItems;
	width?: DynamicSize<string> | string;
	spacingX?: SpacingSize;
	spacingY?: SpacingSize;
	children: React.ReactNode;
}

export default function Wrap({
	justify,
	align = "center",
	spacingX = "md",
	spacingY = "md",
	width,
	children,
}: Props) {
	const justifyContent = getDynamicSize("flex-start", justify);
	const renderWidth = getDynamicSize("100%", width);

	return (
		<div
			css={css`
				width: ${renderWidth};
				display: flex;
				flex-wrap: wrap;
				row-gap: ${getSpacing(spacingX)};
				column-gap: ${getSpacing(spacingY)};
				justify-content: ${justifyContent};
				align-items: ${align};
			`}
		>
			{children}
		</div>
	);
}
