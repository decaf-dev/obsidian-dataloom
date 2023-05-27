import { css } from "@emotion/react";
import { Platform } from "obsidian";
import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

type Justify = "flex-start" | "center" | "flex-end" | "space-between";
type Align = "flex-start" | "center" | "flex-end";

const DEFAULT_JUSTIFY = "flex-start";

interface DynamicSize<T> {
	base: T;
	mobile?: T;
}

interface Props {
	justify?: DynamicSize<Justify> | Justify;
	align?: Align;
	spacingX?: SpacingSize;
	spacingY?: SpacingSize;
	children: React.ReactNode;
}

export default function Wrap({
	justify = "flex-start",
	align = "center",
	spacingX = "md",
	spacingY = "md",
	children,
}: Props) {
	const isMobile = Platform.isMobile;

	let justifyContent = DEFAULT_JUSTIFY;
	if (justify !== undefined) {
		if (typeof justify === "string") {
			justifyContent = justify;
		} else {
			if (isMobile && justify.mobile !== undefined) {
				justifyContent = justify.mobile;
			} else {
				justifyContent = justify.base;
			}
		}
	}

	return (
		<div
			css={css`
				width: 100%;
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
