import { css } from "@emotion/react";
import { getSpacing } from "src/shared/spacing";
import { SpacingSize } from "src/shared/spacing/types";

interface Props {
	className?: string;
	px?: SpacingSize;
	py?: SpacingSize;
	pl?: SpacingSize;
	pt?: SpacingSize;
	pb?: SpacingSize;
	p?: SpacingSize;
	width?: string;
	children: React.ReactNode;
}

export default function Padding({
	width = "100%",
	px,
	py,
	pt,
	pb,
	pl,
	p,
	children,
}: Props) {
	let renderPt = "";
	let renderPb = "";
	let renderPl = "";
	let renderPr = "";

	if (p) {
		renderPt = getSpacing(p);
		renderPb = getSpacing(p);
		renderPl = getSpacing(p);
		renderPr = getSpacing(p);
	} else if (px || py) {
		if (px) {
			const spacing = getSpacing(px);
			renderPl = spacing;
			renderPr = spacing;
		}
		if (py) {
			const spacing = getSpacing(py);
			renderPt = spacing;
			renderPb = spacing;
		}
	} else if (pb || pt || pl) {
		if (pb) {
			const spacing = getSpacing(pb);
			renderPb = spacing;
		}
		if (pt) {
			const spacing = getSpacing(pt);
			renderPt = spacing;
		}
		if (pl) {
			const spacing = getSpacing(pl);
			renderPl = spacing;
		}
	}

	return (
		<div
			css={css`
				width: ${width};
				padding-top: ${renderPt};
				padding-bottom: ${renderPb};
				padding-left: ${renderPl};
				padding-right: ${renderPr};
			`}
		>
			{children}
		</div>
	);
}
