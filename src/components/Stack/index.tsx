interface Props {
	spacing?: "sm" | "md" | "lg" | "xl" | "2xl";
	children: React.ReactNode;
	isVertical?: boolean;
}

export default function Stack({ spacing = "md", children, isVertical }: Props) {
	let gap = "";
	if (spacing === "sm") {
		gap = "var(--nlt-spacing--sm)";
	} else if (spacing === "md") {
		gap = "var(--nlt-spacing--md)";
	} else if (spacing === "lg") {
		gap = "var(--nlt-spacing--lg)";
	} else if (spacing === "xl") {
		gap = "var(--nlt-spacing--xl)";
	} else if (spacing === "2xl") {
		gap = "var(--nlt-spacing--2xl)";
	}
	return (
		<div
			style={{
				display: "flex",
				flexDirection: isVertical ? "column" : "row",
				alignItems: isVertical ? "flex-start" : "center",
				justifyContent: isVertical ? "center" : "flex-start",
				[isVertical ? "rowGap" : "columnGap"]: gap,
			}}
		>
			{children}
		</div>
	);
}
