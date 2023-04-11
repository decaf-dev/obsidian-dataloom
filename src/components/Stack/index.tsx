import { getSpacing } from "src/services/spacing";
import { SpacingSize } from "src/services/spacing/types";

interface Props {
	spacing?: SpacingSize;
	children: React.ReactNode;
	justify?: "flex-start" | "center" | "flex-end";
	isVertical?: boolean;
}

export default function Stack({
	spacing = "md",
	justify = "flex-start",
	children,
	isVertical,
}: Props) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: isVertical ? "column" : "row",
				alignItems: isVertical ? "flex-start" : "center",
				justifyContent: isVertical ? "center" : justify,
				[isVertical ? "rowGap" : "columnGap"]: getSpacing(spacing),
				...(isVertical ? { height: "100%" } : { width: "100%" }),
			}}
		>
			{children}
		</div>
	);
}
