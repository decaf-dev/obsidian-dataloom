import { numToPx, pxToNum } from "src/shared/conversion";
import { useColumnResize } from "../use-column-resize";
import { MIN_COLUMN_WIDTH } from "src/shared/constants";

import "./styles.css";

interface Props {
	columnIndex: number;
	currentResizingId: string | null;
	columnId: string;
	width: string;
	onWidthChange: (columnId: string, value: string) => void;
	onMenuClose: () => void;
}

export default function ColumnResize({
	columnIndex,
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

	function updateColumnWidth() {
		const columnEl = document.body.querySelector(
			`.dataloom-cell[data-column-id="${columnId}"] .dataloom-cell--header__container`
		);
		if (!columnEl) throw new Error("Cannot find column element");
		const width = columnEl.getBoundingClientRect().width;
		onWidthChange(columnId, numToPx(width));
	}

	function toggleAutoWidthClass(
		selectors: NodeListOf<Element>,
		shouldAdd: boolean
	) {
		selectors.forEach((selector) => {
			const container = selector.querySelector(
				".dataloom-cell--header__container, .dataloom-cell--body__container, .dataloom-cell--footer__container"
			);
			if (!container) return;
			const containerEl = container as HTMLElement;

			if (shouldAdd) {
				containerEl.classList.add("dataloom-auto-width");
			} else {
				containerEl.classList.remove("dataloom-auto-width");
			}
		});
	}

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
					if (e.detail === 2) {
						//Get the cells in the current column
						const selectors = document.body.querySelectorAll(
							`.dataloom-cell:nth-child(${columnIndex + 1})`
						);
						//Add auto width
						toggleAutoWidthClass(selectors, true);
						//Update the width
						updateColumnWidth();
						//Remove auto width
						setTimeout(() => {
							toggleAutoWidthClass(selectors, false);
						}, 0);
					}
				}}
			/>
		</div>
	);
}
