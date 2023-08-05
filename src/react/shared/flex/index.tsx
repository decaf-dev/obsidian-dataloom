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
	children: React.ReactNode;
}

export default function Flex({
	flexDir = "row",
	justify = "flex-start",
	align = "flex-start",
	children,
}: Props) {
	return (
		<div
			style={{
				flexDirection: flexDir,
				justifyContent: justify,
				alignItems: align,
			}}
		>
			{children}
		</div>
	);
}
