import Icon from "../../shared/icon";
import MenuButton from "../../shared/menu-button";
import RowMenu from "./components/RowMenu";

import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";

import { useDragContext } from "src/shared/dragging/drag-context";
import { dropDrag, getRowId } from "src/shared/dragging/utils";
import { useTableState } from "src/shared/table-state/table-state-context";
import { css } from "@emotion/react";

interface Props {
	rowId: string;
	onDeleteClick: (rowId: string) => void;
}

export default function RowOptions({ rowId, onDeleteClick }: Props) {
	const { menu, isMenuOpen, menuRef, closeTopMenu } = useMenu(MenuLevel.ONE);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		openDirection: "right",
	});

	const { dragData, touchDropZone, setDragData, setTouchDropZone } =
		useDragContext();
	const { tableState, setTableState } = useTableState();

	function handleDeleteClick(rowId: string) {
		onDeleteClick(rowId);
		closeTopMenu();
	}

	function handleMouseDown(e: React.MouseEvent) {
		//On mouse down we create a synthetic drag event
		//We do this because we have prevent the ability for the user to drag the row
		//Otherwise the user would be able to drag the row from any cell in the table
		const el = e.target as HTMLElement;
		const row = el.closest("tr");
		if (row) {
			row.setAttr("draggable", true);
			const dragStartEvent = new DragEvent("dragstart");
			Object.defineProperty(dragStartEvent, "target", {
				value: row,
			});
			row.dispatchEvent(dragStartEvent);
		}
	}

	function handleTouchStart(e: React.TouchEvent) {
		e.stopPropagation();

		//The target will be the td element
		//The current target will be the parent tr element
		const targetEl = e.currentTarget as HTMLElement;
		const rowEl = targetEl.closest("tr");
		if (!rowEl) throw new Error("Row not found");

		const rowId = getRowId(rowEl);
		if (!rowId) return;

		setDragData({
			type: "row",
			id: rowId,
		});
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		e.stopPropagation();

		if (dragData == null) return;

		const { clientX, clientY } = e.touches[0];

		// Get the element underneath the dragging element at the current position
		const elementUnderneath = document.elementFromPoint(clientX, clientY);

		if (!elementUnderneath) return;

		const rowEl = elementUnderneath.closest("tr");
		if (!rowEl) return;

		const targetId = getRowId(rowEl);
		if (!targetId) return;

		//If we're dragging over the same row, then return
		if (targetId === dragData.id) return;

		const { top, left, bottom, right } = rowEl.getBoundingClientRect();

		setTouchDropZone({
			id: targetId,
			top,
			left,
			bottom,
			right,
		});

		removeDragHover();
		addDragHover(rowEl);
	};

	function handleTouchCancel() {
		endDrag();
	}

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
				dropDrag(touchDropZone.id, dragData, tableState, setTableState);
			}
		}
		endDrag();
	}

	function endDrag() {
		setDragData(null);
		setTouchDropZone(null);
		removeDragHover();
	}

	function addDragHover(rowEl: HTMLElement) {
		//Add dragging over class to all the children
		const children = rowEl.querySelectorAll("td:not(:last-child)");

		for (let i = 0; i < children.length; i++) {
			children[i].classList.add("DataLoom__tr--drag-over");
		}
	}

	function removeDragHover() {
		//Add dragging over class to all the children
		const children = document.querySelectorAll(".DataLoom_tr--drag-over");

		for (let i = 0; i < children.length; i++) {
			children[i].classList.remove("DataLoom__tr--drag-over");
		}
	}

	return (
		<>
			<div
				className="DataLoom__row-options"
				css={css`
					width: 100%;
					height: 100%;
				`}
			>
				<div
					ref={triggerRef}
					css={css`
						width: 100%;
						height: 100%;
						padding-left: 5px;
					`}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					onTouchCancel={handleTouchCancel}
				>
					<MenuButton
						menu={menu}
						icon={<Icon lucideId="grip-vertical" />}
						ariaLabel="Drag to move or click to open"
						onMouseDown={handleMouseDown}
					/>
				</div>
			</div>
			<RowMenu
				id={menu.id}
				rowId={rowId}
				ref={menuRef}
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				onDeleteClick={handleDeleteClick}
			/>
		</>
	);
}
