import { css } from "@emotion/react";
import {
	AlignItems,
	FlexDirection,
	JustifyContent,
} from "src/shared/renderTypes";

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
			css={css`
				width: 100%;
				display: flex;
				flex-direction: ${flexDir};
				justify-content: ${justify};
				align-items: ${align};
				flex-wrap: wrap;
			`}
		>
			{children}
		</div>
	);
}
