import { AlignItems, JustifyContent } from "src/shared/render/types";
import { getDynamicSize } from "src/shared/render/utils";
import { getSpacing } from "src/shared/spacing";
import { DynamicSize, SpacingSize } from "src/shared/spacing/types";

import "./styles.css";

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
			className="dataloom-wrap"
			style={{
				width: renderWidth,
				rowGap: getSpacing(spacingX),
				columnGap: getSpacing(spacingY),
				justifyContent,
				alignItems: align,
			}}
		>
			{children}
		</div>
	);
}
