import { useTableState } from "src/shared/table-state/table-state-context";
import { SortDir } from "src/shared/types/types";
import { useDragContext } from "src/shared/dragging/drag-context";

interface TableBodyRowProps {
	children?: React.ReactNode;
}

export default function TableBodyRow({
	children,
	...props
}: TableBodyRowProps) {
	const { tableState, setTableState } = useTableState();
	const { dragData, touchDropZone, setDragData, setTouchDropZone } =
		useDragContext();

	function startDrag(el: HTMLElement) {
		const rowId = getRowId(el);
		if (!rowId) return;

		setDragData({
			type: "row",
			id: rowId,
		});
	}

	function endDrag(el: HTMLElement) {
		el.draggable = false;
		setDragData(null);
	}

	function dropDrag(targetRowId: string) {
		if (dragData === null) throw Error("No drag data found");

		//If we're dragging a column type, then return
		if (dragData.type !== "row") return;

		const { columns } = tableState.model;
		const isSorted = columns.find(
			(column) => column.sortDir !== SortDir.NONE
		);
		if (isSorted) {
			if (
				!window.confirm(
					"This will set your default sorting to the current sort filter. Do you wish to continue?" +
						"\n\n" +
						"If not, please remove your sort filter before dragging a row."
				)
			)
				return;
		}

		setTableState((prevState) => {
			const { bodyRows, columns } = prevState.model;

			const draggedElIndex = bodyRows.findIndex(
				(row) => row.id === dragData.id
			);
			const targetElIndex = bodyRows.findIndex(
				(row) => row.id == targetRowId
			);

			const newRows = structuredClone(bodyRows);
			const draggedEl = newRows[draggedElIndex];

			//Remove the element
			newRows.splice(draggedElIndex, 1);
			//Append it to the new location
			newRows.splice(targetElIndex, 0, draggedEl);

			//Set the current index of all the values to their current positions
			//This will allow us to retain the order of sorted rows once we drag an item
			newRows.forEach((row, index) => {
				row.index = index;
			});

			return {
				...prevState,
				model: {
					...prevState.model,
					bodyRows: newRows,
					columns: columns.map((column) => {
						//If we're sorting, reset the sort
						return {
							...column,
							sortDir: SortDir.NONE,
						};
					}),
				},
			};
		});
	}

	//We throw an error if the system
	function getRowId(rowEl: HTMLElement) {
		//React Virtuoso only works with our keyboard focus navigation system when we memorize the row component
		//We can only do this if we don't place a `data-row-id` attr on the row itself. The workaround to this is to place
		//the `data-row-id` attr on the last td element in the row (which contains the drag menu)
		const dragMenuEl = rowEl.querySelector("td:last-child");
		if (!dragMenuEl) return null;

		const id = dragMenuEl.getAttr("data-row-id");
		if (!id) return null;
		return id;
	}

	function addDragHover(rowEl: HTMLElement) {
		//Add dragging over class to all the children
		const children = rowEl.querySelectorAll("td:not(:last-child)");

		for (var i = 0; i < children.length; i++) {
			children[i].classList.add("NLT__tr--drag-over");
		}
	}

	function removeDragHover() {
		//Add dragging over class to all the children
		const children = document.querySelectorAll(".NLT__tr--drag-over");

		for (var i = 0; i < children.length; i++) {
			children[i].classList.remove("NLT__tr--drag-over");
		}
	}

	function handleTouchStart(e: React.TouchEvent) {
		e.stopPropagation();

		//The target will be the td element
		//The current target will be the parent tr element
		const el = e.currentTarget as HTMLElement;
		startDrag(el);
	}

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		startDrag(el);
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

	function handleDragEnd(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		endDrag(el);
	}

	function handleTouchEnd(e: React.TouchEvent) {
		const el = e.target as HTMLElement;

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

		endDrag(el);
		setTouchDropZone(null);
		removeDragHover();
	}

	function handleTouchCancel(e: React.TouchEvent) {
		const el = e.target as HTMLElement;
		endDrag(el);
		setTouchDropZone(null);
		removeDragHover();
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		//The target will be the td element
		//The current target will be the parent tr element
		const target = e.currentTarget as HTMLElement;

		const targetId = getRowId(target);
		if (!targetId) return;

		dropDrag(targetId);
	}

	function handleDragOver(e: React.DragEvent) {
		//Alow drop
		e.preventDefault();
	}

	return (
		<tr
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchCancel}
			{...props}
		>
			{children}
		</tr>
	);
}
