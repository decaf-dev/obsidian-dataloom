import { useDragContext } from "src/shared/dragging/drag-context";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useStickyOffset } from "./hooks";
import { numToPx } from "src/shared/conversion";
import React from "react";

interface Props {
	index: number;
	columnId: string;
	isDraggable: boolean;
	numFrozenColumns: number;
	content: React.ReactNode;
}

export default function HeaderCell({
	index,
	columnId,
	isDraggable,
	numFrozenColumns,
	content,
}: Props) {
	const { setLoomState } = useLoomState();
	const { dragData, touchDropZone, setDragData, setTouchDropZone } =
		useDragContext();
	const ref = React.useRef<HTMLDivElement>(null);
	const leftOffset = useStickyOffset(ref, numFrozenColumns, index);
	const shouldFreeze = index + 1 <= numFrozenColumns;

	function startDrag(el: HTMLElement) {
		const columnId = getColumnId(el);
		if (!columnId) return;

		setDragData({
			type: "column",
			id: columnId,
		});
	}

	function dropDrag(targetRowId: string) {
		if (dragData == null) throw new Error("No drag data found");

		//If we're dragging a column type, then return
		if (dragData.type !== "column") return;

		setLoomState((prevState) => {
			const { columns } = prevState.model;

			const draggedElIndex = columns.findIndex(
				(column) => column.id === dragData.id
			);
			const targetElIndex = columns.findIndex(
				(column) => column.id === targetRowId
			);

			const newColumns = structuredClone(columns);
			const draggedEl = newColumns[draggedElIndex];

			//Remove the element
			newColumns.splice(draggedElIndex, 1);
			//Append it to the new location
			newColumns.splice(targetElIndex, 0, draggedEl);

			//Set cells of all the rows to the new order of columns
			const nextRows = prevState.model.rows.map((row) => {
				const { cells } = row;
				const nextCells = cells.sort((a, b) => {
					const aIndex = newColumns.findIndex(
						(column) => column.id === a.columnId
					);
					const bIndex = newColumns.findIndex(
						(column) => column.id === b.columnId
					);
					return aIndex - bIndex;
				});
				return {
					...row,
					cells: nextCells,
				};
			});

			return {
				...prevState,
				model: {
					...prevState.model,
					columns: newColumns,
					rows: nextRows,
				},
			};
		});
	}

	function addDragHover(thEl: HTMLElement) {
		const child: HTMLElement | undefined = thEl.firstChild as HTMLElement;
		if (!child) return;

		if (child.classList.contains("dataloom-focusable"))
			thEl.classList.add("dataloom-th--drag-over");
	}

	function removeDragHover() {
		//Add dragging over class to all the children
		const el = document.querySelector(".dataloom-th--drag-over");
		if (el) el.classList.remove("dataloom-th--drag-over");
	}

	//We throw an error if the system
	function getColumnId(columnEl: HTMLElement) {
		const id = columnEl.getAttribute("data-column-id");
		if (!id) return null;
		return id;
	}
	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		startDrag(el);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		//The target will be the td element
		//The current target will be the parent tr element
		const target = e.currentTarget as HTMLElement;

		const targetId = getColumnId(target);
		if (!targetId) return;

		dropDrag(targetId);
	}

	function handleDragEnd() {
		setDragData(null);
	}

	function handleDragOver(e: React.DragEvent) {
		//Allow drop
		e.preventDefault();
	}

	function handleTouchStart(e: React.TouchEvent) {
		e.stopPropagation();

		//The target will be the td element
		//The current target will be the parent tr element
		const el = e.currentTarget as HTMLElement;
		startDrag(el);
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		e.stopPropagation();

		if (dragData == null) return;

		const { clientX, clientY } = e.touches[0];

		// Get the element underneath the dragging element at the current position
		const elementUnderneath = document.elementFromPoint(clientX, clientY);
		if (!elementUnderneath) return;

		const thEl = elementUnderneath.closest(
			".dataloom-cell--header"
		) as HTMLElement | null;
		if (!thEl) return;

		const targetId = getColumnId(thEl);
		if (!targetId) return;
		//If we're dragging over the same column, then return
		if (targetId === dragData.id) return;

		const { top, left, bottom, right } = thEl.getBoundingClientRect();

		setTouchDropZone({
			id: targetId,
			top,
			left,
			bottom,
			right,
		});

		removeDragHover();
		if (thEl.lastChild) addDragHover(thEl);
	};

	function handleTouchEnd(e: React.TouchEvent) {
		if (touchDropZone) {
			const touchX = e.changedTouches[0].clientX;
			const touchY = e.changedTouches[0].clientY;

			//Check if the touch is inside the drop zone
			const isInsideDropZone =
				touchX >= touchDropZone.left &&
				touchX <= touchDropZone.right &&
				touchY >= touchDropZone.top &&
				touchY <= touchDropZone.bottom;

			if (isInsideDropZone) {
				dropDrag(touchDropZone.id);
			}
		}

		setDragData(null);
		setTouchDropZone(null);
		removeDragHover();
	}

	function handleTouchCancel() {
		setDragData(null);
		setTouchDropZone(null);
		removeDragHover();
	}

	let className = "dataloom-cell dataloom-cell--header";
	if (shouldFreeze)
		className += " dataloom-cell--freeze dataloom-cell--freeze-header";
	return (
		<div
			className={className}
			ref={ref}
			data-column-id={columnId}
			style={{
				left: shouldFreeze ? numToPx(leftOffset) : undefined,
			}}
			{...(isDraggable && {
				draggable: true,
				onDrop: handleDrop,
				onDragStart: handleDragStart,
				onDragOver: handleDragOver,
				onDragEnd: handleDragEnd,
				onTouchStart: handleTouchStart,
				onTouchMove: handleTouchMove,
				onTouchEnd: handleTouchEnd,
				onTouchCancel: handleTouchCancel,
			})}
		>
			{content}
		</div>
	);
}
