interface Props {
	spacingX?: "sm" | "md" | "lg" | "xl" | "2xl";
	spacingY?: "sm" | "md" | "lg" | "xl" | "2xl";
	style?: { [key: string]: string | number };
	children: React.ReactNode;
}

export default function Stack({
	spacingX = "md",
	spacingY = "md",
	style,
	children,
}: Props) {
	function findSpacing(spacing: string) {
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
		return gap;
	}

	const rowGap = findSpacing(spacingX);
	const columnGap = findSpacing(spacingY);

	return (
		<div
			style={{
				...style,
				display: "flex",
				flexWrap: "wrap",
				rowGap,
				columnGap,
			}}
		>
			{children}
		</div>
	);
}
