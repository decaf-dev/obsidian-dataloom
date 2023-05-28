import { css } from "@emotion/react";
import { isMobile } from "src/shared/renderUtils";
import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

type Justify = "flex-start" | "center" | "flex-end" | "space-between";
type Align = "flex-start" | "center" | "flex-end";

interface DynamicSize<T> {
	base: T;
	mobile?: T;
}

interface Props {
	justify?: DynamicSize<Justify> | Justify;
	align?: Align;
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
	let justifyContent: Justify = "flex-start";
	if (justify !== undefined) {
		if (typeof justify === "string") {
			justifyContent = justify;
		} else {
			if (isMobile() && justify.mobile !== undefined) {
				justifyContent = justify.mobile;
			} else {
				justifyContent = justify.base;
			}
		}
	}

	let renderWidth = "100%";
	if (width !== undefined) {
		if (typeof width === "string") {
			renderWidth = width;
		} else {
			if (isMobile() && width.mobile !== undefined) {
				renderWidth = width.mobile;
			} else {
				renderWidth = width.base;
			}
		}
	}

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
