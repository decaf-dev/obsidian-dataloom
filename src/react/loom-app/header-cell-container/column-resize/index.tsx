import { numToPx, pxToNum } from "src/shared/conversion";
import { useColumnResize } from "../use-column-resize";
import { MIN_COLUMN_WIDTH } from "src/shared/constants";

import "./styles.css";

interface Props {
	currentResizingId: string | null;
	columnId: string;
	width: string;
	onWidthChange: (columnId: string, value: string) => void;
	onMenuClose: () => void;
}

export default function ColumnResize({
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
	let innerClassName = "dataloom-column-resize__handle";
	if (isDragging)
		innerClassName += " dataloom-column-resize__handle--dragging";

	return (
		<div className="dataloom-column-resize">
			<div
				className={innerClassName}
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
