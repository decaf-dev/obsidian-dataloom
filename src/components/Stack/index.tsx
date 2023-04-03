import { getSpacing } from "src/services/spacing";
import { SpacingSize } from "src/services/spacing/types";

interface Props {
	spacing?: SpacingSize;
	children: React.ReactNode;
	isVertical?: boolean;
}

export default function Stack({ spacing = "md", children, isVertical }: Props) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: isVertical ? "column" : "row",
				alignItems: isVertical ? "flex-start" : "center",
				justifyContent: isVertical ? "center" : "flex-start",
				[isVertical ? "rowGap" : "columnGap"]: getSpacing(spacing),
			}}
		>
			{children}
		</div>
	);
}
