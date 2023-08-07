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
	const shouldFreeze = index + 1 <= numFrozenColumns;

	let className = "dataloom-cell dataloom-cell--footer";
	if (shouldFreeze)
		className += " dataloom-cell--freeze dataloom-cell--freeze-footer";
	return (
		<div
			ref={ref}
			className={className}
			style={{
				left: shouldFreeze ? numToPx(leftOffset) : undefined,
			}}
		>
			{content}
		</div>
	);
}
