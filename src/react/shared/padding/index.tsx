import { getSpacing } from "src/shared/spacing";
import type { SpacingSize } from "src/shared/spacing/types";

interface Props {
	className?: string;
	px?: SpacingSize;
	py?: SpacingSize;
	pl?: SpacingSize;
	pr?: SpacingSize;
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
	pr,
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
	}

	if (px) {
		const spacing = getSpacing(px);
		renderPl = spacing;
		renderPr = spacing;
	} else if (pl || pr) {
		if (pl) {
			const spacing = getSpacing(pl);
			renderPl = spacing;
		}
		if (pr) {
			const spacing = getSpacing(pr);
			renderPr = spacing;
		}
	}

	if (py) {
		const spacing = getSpacing(py);
		renderPt = spacing;
		renderPb = spacing;
	} else if (pt || pb) {
		if (pt) {
			const spacing = getSpacing(pt);
			renderPt = spacing;
		}
		if (pb) {
			const spacing = getSpacing(pb);
			renderPb = spacing;
		}
	}

	return (
		<div
			className="dataloom-padding"
			style={{
				width,
				paddingTop: renderPt,
				paddingBottom: renderPb,
				paddingLeft: renderPl,
				paddingRight: renderPr,
			}}
		>
			{children}
		</div>
	);
}
