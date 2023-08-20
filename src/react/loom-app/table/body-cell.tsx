import React from "react";
import { useStickyOffset } from "./hooks";
import { numToPx } from "src/shared/conversion";

interface Props {
	rowId: string;
	index: number;
	numFrozenColumns: number;
	content: React.ReactNode;
}

export default function BodyCell({
	rowId,
	index,
	numFrozenColumns,
	content,
}: Props) {
	const ref = React.useRef<HTMLDivElement>(null);
	const leftOffset = useStickyOffset(ref, numFrozenColumns, index);
	const shouldFreeze = index + 1 <= numFrozenColumns;

	let className = "dataloom-cell dataloom-cell--body";
	if (shouldFreeze) className += " dataloom-cell--freeze";
	return (
		<div
			className={className}
			ref={ref}
			data-row-id={index === 0 ? rowId : undefined}
			style={{ left: shouldFreeze ? numToPx(leftOffset) : undefined }}
		>
			{content}
		</div>
	);
}
