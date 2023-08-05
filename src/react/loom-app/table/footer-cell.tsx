import React from "react";
import { useStickyOffset } from "./hooks";
import { numToPx } from "src/shared/conversion";

interface Props {
	index: number;
	content: React.ReactNode;
	numFrozenColumns: number;
}

export default function FooterCell({
	index,
	content,
	numFrozenColumns,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const leftOffset = useStickyOffset(ref, numFrozenColumns, index);

	let className = "dataloom-cell dataloom-cell--footer";
	if (index + 1 <= numFrozenColumns)
		className += " dataloom-cell--freeze dataloom-cell--freeze-footer";
	return (
		<div
			ref={ref}
			className={className}
			style={{ left: numToPx(leftOffset) }}
		>
			{content}
		</div>
	);
}
