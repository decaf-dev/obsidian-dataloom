import Icon from "../../shared/icon";
import MenuButton from "../../shared/menu-button";
import RowMenu from "./row-menu";
import Padding from "src/react/shared/padding";

import { useDragContext } from "src/shared/dragging/drag-context";
import { getRowId } from "src/shared/dragging/utils";
import { useLoomState } from "src/react/loom-app/loom-state-provider";

import { useMenu } from "../../shared/menu/hooks";

import "./styles.css";
import { Source } from "src/shared/loom-state/types/loom-state";
import { confirmSortOrderChange } from "src/shared/sort-utils";
import { RowReorderHandler } from "../app/hooks/use-row/types";

interface Props {
	rowId: string;
	source: Source | null;
	onDeleteClick: (rowId: string) => void;
	onInsertAboveClick: (rowId: string) => void;
	onInsertBelowClick: (rowId: string) => void;
	onRowReorder: RowReorderHandler;
}

export default function RowOptions({
	rowId,
	source,
	onDeleteClick,
	onInsertAboveClick,
	onInsertBelowClick,
	onRowReorder,
}: Props) {
	const {
		menu,
		triggerRef,
		triggerPosition,
		isOpen,
		onOpen,
		onClose,
		onRequestClose,
	} = useMenu();

	const { dragData, touchDropZone, setDragData, setTouchDropZone } =
		useDragContext();
	const { loomState } = useLoomState();

	function handleDeleteClick() {
		onDeleteClick(rowId);
		onClose();
	}

	function handleInsertAboveClick() {
		onInsertAboveClick(rowId);
		onClose();
	}

	function handleInsertBelowClick() {
		onInsertBelowClick(rowId);
		onClose();
	}

	function handleMouseDown(e: React.MouseEvent) {
		//On mouse down we create a synthetic drag event
		//We do this because we have prevent the ability for the user to drag the row
		//Otherwise the user would be able to drag the row from any cell in the table
		const el = e.target as HTMLElement;
		const row = el.closest(".dataloom-row");
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
		const rowEl = targetEl.closest(".dataloom-row") as HTMLElement | null;
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

		const rowEl = elementUnderneath.closest(
			".dataloom-row"
		) as HTMLElement | null;
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
				if (dragData === null) throw Error("No drag data found");

				//If we're dragging a column type, then return
				if (dragData.type !== "row") return;

				if (!confirmSortOrderChange(loomState)) return;

				onRowReorder(dragData.id, touchDropZone.id);
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
		const children = rowEl.querySelectorAll(".dataloom-cell");

		for (let i = 0; i < children.length; i++) {
			children[i].classList.add("dataloom-tr--drag-over");
		}
	}

	function removeDragHover() {
		//Add dragging over class to all the children
		const children = document.querySelectorAll(".dataloom-tr--drag-over");

		for (let i = 0; i < children.length; i++) {
			children[i].classList.remove("dataloom-tr--drag-over");
		}
	}

	return (
		<>
			<div className="dataloom-row-options">
				<Padding p="sm">
					<div
						className="dataloom-row-options__container"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
						onTouchCancel={handleTouchCancel}
					>
						<MenuButton
							ref={triggerRef}
							menu={menu}
							icon={<Icon lucideId="grip-vertical" />}
							ariaLabel="Drag to move or click to open"
							onMouseDown={handleMouseDown}
							onOpen={onOpen}
						/>
					</div>
				</Padding>
			</div>
			<RowMenu
				id={menu.id}
				isOpen={isOpen}
				triggerPosition={triggerPosition}
				canDeleteRow={source === null}
				onDeleteClick={handleDeleteClick}
				onInsertAboveClick={handleInsertAboveClick}
				onInsertBelowClick={handleInsertBelowClick}
				onRequestClose={onRequestClose}
				onClose={onClose}
			/>
		</>
	);
}
