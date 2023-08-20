import { SortDir } from "src/shared/loom-state/types";

import {
	focusNextElement,
	getFocusableMenuEl,
	removeCurrentFocusClass,
} from "src/react/loom-app/app/hooks/use-focus/focus-visible";
import { useMenuOperations } from "src/react/shared/menu/hooks";
import {
	moveFocusDown,
	moveFocusLeft,
	moveFocusRight,
	moveFocusUp,
	moveMenuFocusDown,
	moveMenuFocusUp,
} from "src/react/loom-app/app/hooks/use-focus/move-focus";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "src/react/loom-app/loom-state-provider";
import { useMountState } from "src/react/loom-app/mount-provider";

export default function useFocus() {
	const logger = useLogger();
	const { appId } = useMountState();
	const { loomState } = useLoomState();
	const { onRequestCloseTop, topMenu } = useMenuOperations();

	function handleClick(e: React.MouseEvent) {
		logger("useFocus handleClick");
		//Stop propagation to the global event
		e.stopPropagation();
		onRequestCloseTop();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("useFocus handleKeyDown");
		e.stopPropagation();

		if (e.key === "Tab") {
			removeCurrentFocusClass();

			//Prevent default tab behavior which is to move focus to next element
			//We will do that ourselves
			e.preventDefault();

			const menuEl = getFocusableMenuEl(topMenu, appId);
			if (!menuEl) return;

			const focusableEls = menuEl.querySelectorAll(".dataloom-focusable");
			if (focusableEls.length === 0) return;

			focusNextElement(menuEl, focusableEls);
		} else if (
			e.key === "ArrowDown" ||
			e.key === "ArrowUp" ||
			e.key === "ArrowLeft" ||
			e.key === "ArrowRight"
		) {
			const layerEl = getFocusableMenuEl(topMenu, appId);
			if (!layerEl) return;

			const focusableEls = layerEl.querySelectorAll(
				".dataloom-focusable"
			);
			if (focusableEls.length === 0) return;

			//Prevent default scrolling of the table container
			e.preventDefault();

			const focusedEl = document.activeElement;

			let index = -1;
			if (focusedEl) index = Array.from(focusableEls).indexOf(focusedEl);

			const numVisibleColumns = loomState.model.columns.filter(
				(column) => column.isVisible
			).length;
			const numBodyRows = loomState.model.bodyRows.length;
			const numSortedColumns = loomState.model.columns.filter(
				(column) => column.sortDir !== SortDir.NONE
			).length;

			let elementToFocus: Element | null = null;

			switch (e.key) {
				case "ArrowLeft":
					elementToFocus = moveFocusLeft(focusableEls, index);
					break;
				case "ArrowRight":
					elementToFocus = moveFocusRight(focusableEls, index);
					break;
				case "ArrowUp":
					if (topMenu !== null) {
						elementToFocus = moveMenuFocusUp(focusableEls, index);
					} else {
						elementToFocus = moveFocusUp(
							focusableEls,
							numVisibleColumns,
							numBodyRows,
							numSortedColumns,
							index
						);
					}
					break;
				case "ArrowDown":
					if (topMenu !== null) {
						elementToFocus = moveMenuFocusDown(focusableEls, index);
					} else {
						elementToFocus = moveFocusDown(
							focusableEls,
							numVisibleColumns,
							numBodyRows,
							numSortedColumns,
							index
						);
						break;
					}
			}
			if (elementToFocus !== null) {
				removeCurrentFocusClass();
				(elementToFocus as HTMLElement).focus();
			}
		}
	}

	return {
		onFocusClick: handleClick,
		onFocusKeyDown: handleKeyDown,
	};
}
