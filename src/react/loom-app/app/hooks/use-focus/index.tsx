// import { SortDir } from "src/shared/loom-state/types";

// import {
// 	isMacRedoDown,
// 	isMacUndoDown,
// 	isWindowsRedoDown,
// 	isWindowsUndoDown,
// } from "src/shared/keyboard-event";
// import {
// 	// focusNextElement,
// 	// getFocusableLayerEl,
// 	removeCurrentFocusClass,
// } from "src/react/loom-app/app/hooks/use-focus/focus-visible";
import { useMenuOperations } from "src/react/shared/menu/hooks";
import { nltEventSystem } from "src/shared/event-system/event-system";
// import {
// 	moveFocusDown,
// 	moveFocusLeft,
// 	moveFocusRight,
// 	moveFocusUp,
// 	moveMenuFocusDown,
// 	moveMenuFocusUp,
// } from "src/react/loom-app/app/hooks/use-focus/move-focus";
import { useLogger } from "src/shared/logger";

export default function useFocus() {
	const logger = useLogger();
	const { onRequestCloseTop } = useMenuOperations();
	function handleClick(e: React.MouseEvent) {
		logger("LoomApp handleClick");
		//Stop propagation to the global event
		e.stopPropagation();
		onRequestCloseTop();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("LoomApp handleKeyDown");
		e.stopPropagation();

		// if (e.key === "Tab") {
		// 	//Remove any class that has focus
		// 	removeCurrentFocusClass();

		// 	//Prevent default tab behavior
		// 	//which is to move focus to next element
		// 	//We will do that ourselves
		// 	e.preventDefault();

		// 	const layerEl = getFocusableLayerEl(appId);
		// 	if (!layerEl) return;

		// 	const focusableEls = layerEl.querySelectorAll(
		// 		".dataloom-focusable"
		// 	);
		// 	if (focusableEls.length === 0) return;

		// 	focusNextElement(layerEl, focusableEls);
		// } else if (isWindowsRedoDown(e) || isMacRedoDown(e)) {
		// 	//Prevent Obsidian action bar from triggering
		// 	e.preventDefault();
		// 	commandRedo();
		// } else if (isWindowsUndoDown(e) || isMacUndoDown(e)) {
		// 	//Prevent Obsidian action bar from triggering
		// 	e.preventDefault();
		// 	commandUndo();
		// } else if (
		// 	e.key === "ArrowDown" ||
		// 	e.key === "ArrowUp" ||
		// 	e.key === "ArrowLeft" ||
		// 	e.key === "ArrowRight"
		// ) {
		// 	const layerEl = getFocusableLayerEl(appId);
		// 	if (!layerEl) return;

		// 	const focusableEls = layerEl.querySelectorAll(
		// 		".dataloom-focusable"
		// 	);
		// 	if (focusableEls.length === 0) return;

		// 	//Prevent default scrolling of the table container
		// 	e.preventDefault();

		// 	const focusedEl = document.activeElement;

		// 	let index = -1;
		// 	if (focusedEl) index = Array.from(focusableEls).indexOf(focusedEl);

		// 	const numVisibleColumns = loomState.model.columns.filter(
		// 		(column) => column.isVisible
		// 	).length;
		// 	const numBodyRows = loomState.model.bodyRows.length;
		// 	const numSortedColumns = loomState.model.columns.filter(
		// 		(column) => column.sortDir !== SortDir.NONE
		// 	).length;

		// 	let elementToFocus: Element | null = null;

		// 	switch (e.key) {
		// 		case "ArrowLeft":
		// 			elementToFocus = moveFocusLeft(focusableEls, index);
		// 			break;
		// 		case "ArrowRight":
		// 			elementToFocus = moveFocusRight(focusableEls, index);
		// 			break;
		// 		case "ArrowUp":
		// 			if (hasOpenMenu()) {
		// 				elementToFocus = moveMenuFocusUp(focusableEls, index);
		// 			} else {
		// 				elementToFocus = moveFocusUp(
		// 					focusableEls,
		// 					numVisibleColumns,
		// 					numBodyRows,
		// 					numSortedColumns,
		// 					index
		// 				);
		// 			}
		// 			break;
		// 		case "ArrowDown":
		// 			if (hasOpenMenu()) {
		// 				elementToFocus = moveMenuFocusDown(focusableEls, index);
		// 			} else {
		// 				elementToFocus = moveFocusDown(
		// 					focusableEls,
		// 					numVisibleColumns,
		// 					numBodyRows,
		// 					numSortedColumns,
		// 					index
		// 				);
		// 				break;
		// 			}
		// 	}
		// 	if (elementToFocus !== null) {
		// 		removeCurrentFocusClass();
		// 		(elementToFocus as HTMLElement).focus();
		// 	}
		// }

		//Send the event to the event system
		//This is necessary to enabling scrolling with the arrow keys
		nltEventSystem.dispatchEvent("keydown", e);
	}

	return {
		handleClick,
		handleKeyDown,
	};
}
