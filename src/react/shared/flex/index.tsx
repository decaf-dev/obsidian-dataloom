import {
	AlignItems,
	FlexDirection,
	JustifyContent,
} from "src/shared/render/types";

import "./styles.css";

interface Props {
	flexDir?: FlexDirection;
	justify?: JustifyContent;
	align?: AlignItems;
	wrap?: "wrap" | "nowrap";
	width?: string;
	height?: string;
	children: React.ReactNode;
}

export default function Flex({
	flexDir = "row",
	justify = "flex-start",
	align = "flex-start",
	wrap = "wrap",
	width,
	height,
	children,
}: Props) {
	return (
		<div
			className="dataloom-flex"
			style={{
				flexDirection: flexDir,
				justifyContent: justify,
				alignItems: align,
				flexWrap: wrap,
				width,
				height,
			}}
		>
			{children}
		</div>
	);
}
