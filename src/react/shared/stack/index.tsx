import { AlignItems, JustifyContent } from "src/shared/render/types";
import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

import "./styles.css";

interface Props {
	className?: string;
	spacing?: SpacingSize;
	children: React.ReactNode;
	justify?: JustifyContent;
	align?: AlignItems;
	isHorizontal?: boolean;
	grow?: boolean;
	width?: string;
	height?: string;
	minHeight?: string;
	overflow?: "auto" | "hidden" | "scroll" | "visible";
	onClick?: (e: React.MouseEvent) => void;
}

export default function Stack({
	className: customClassName,
	spacing = "md",
	justify,
	align,
	grow,
	overflow,
	children,
	width,
	height,
	minHeight,
	isHorizontal = false,
	onClick,
}: Props) {
	let justifyContent = justify;
	if (justifyContent === undefined) {
		if (!isHorizontal) justifyContent = "center";
		else justifyContent = "flex-start";
	}
	let alignItems = align;
	if (alignItems === undefined) {
		if (isHorizontal) alignItems = "center";
		else alignItems = "flex-start";
	}

	let className = "dataloom-stack";
	if (customClassName) className += " " + customClassName;
	return (
		<div
			className={className}
			style={{
				flexDirection: isHorizontal ? "row" : "column",
				flexGrow: grow ? 1 : 0,
				justifyContent,
				alignItems,
				[isHorizontal ? "columnGap" : "rowGap"]: getSpacing(spacing),
				width,
				height,
				minHeight,
				overflow,
			}}
			onClick={(e) => onClick?.(e)}
		>
			{children}
		</div>
	);
}
