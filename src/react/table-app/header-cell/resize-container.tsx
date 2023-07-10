import { numToPx, pxToNum } from "src/shared/conversion";
import { useColumnResize } from "./use-column-resize";
import { MIN_COLUMN_WIDTH } from "src/shared/table-state/constants";
import { css } from "@emotion/react";

const containerStyle = css`
	position: relative;
`;

const innerStyle = css`
	position: absolute;
	left: -5px;
	cursor: col-resize;
	width: 8px;
	height: 100%;
	&:hover {
		background-color: var(--interactive-accent);
	}
	&:active {
		background-color: var(--interactive-accent);
	}
`;

const dragStyle = css`
	background-color: var(--interactive-accent);
`;

interface Props {
	currentResizingId: string | null;
	columnId: string;
	width: string;
	onWidthChange: (columnId: string, value: string) => void;
	onMenuClose: () => void;
}

export default function ResizeContainer({
	currentResizingId,
	columnId,
	width,
	onWidthChange,
	onMenuClose,
}: Props) {
	const { handleMouseDown, handleTouchStart } = useColumnResize(
		columnId,
		(dist) => {
			const oldWidth = pxToNum(width);
			const newWidth = oldWidth + dist;

			if (newWidth < MIN_COLUMN_WIDTH) return;
			onWidthChange(columnId, numToPx(newWidth));
		}
	);

	const isDragging = columnId === currentResizingId;

	return (
		<div css={containerStyle}>
			<div
				className="DataLoom__resize-handle"
				css={[innerStyle, isDragging && dragStyle]}
				onMouseDown={(e) => {
					onMenuClose();
					handleMouseDown(e);
				}}
				onTouchStart={handleTouchStart}
				onClick={(e) => {
					//Don't propagate to the trigger, which will open the column menu
					e.stopPropagation();

					//If the user is double clicking then set width to max
					if (e.detail === 2) onWidthChange(columnId, "unset");
				}}
			/>
		</div>
	);
}
