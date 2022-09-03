import React, { Children } from "react";

interface Props {
	children: React.ReactNode;
	spacing: string;
	isVertical?: boolean;
}
export default function Stack({
	children,
	spacing,
	isVertical = false,
}: Props) {
	const arr = Children.toArray(children);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: isVertical ? "column" : "row",
				...(isVertical
					? { justifyContent: "center" }
					: { alignItems: "center" }),
			}}
		>
			{arr.map((child, index) => {
				let style = {};
				if (arr.length > 1 && index < arr.length - 1)
					style = isVertical
						? { marginBottom: spacing }
						: { marginRight: spacing };
				return (
					<div key={index} style={style}>
						{child}
					</div>
				);
			})}
		</div>
	);
}
