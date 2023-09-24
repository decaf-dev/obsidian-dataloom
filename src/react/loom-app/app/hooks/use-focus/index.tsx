import {
	focusNextElement,
	getFocusableElements,
	getNumBottomBarFocusableEl,
	getNumOptionBarFocusableEls,
	getTopMenuEl,
	isArrowKeyPressed,
	removeCurrentFocusClass,
} from "src/react/loom-app/app/hooks/use-focus/utils";
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
import { useAppMount } from "src/react/loom-app/app-mount-provider";

export default function useFocus() {
	const logger = useLogger();
	const { reactAppId } = useAppMount();
	const { loomState } = useLoomState();
	const { topMenu } = useMenuOperations();

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("useFocus handleKeyDown");

		if (e.key === "Tab") {
			removeCurrentFocusClass();

			//Prevent default tab behavior which is to move focus to next element
			//We will do that ourselves
			e.preventDefault();

			const menuEl = getTopMenuEl(topMenu, reactAppId);
			if (!menuEl) return;

			const focusableEls = menuEl.querySelectorAll(".dataloom-focusable");
			if (focusableEls.length === 0) return;

			focusNextElement(menuEl, focusableEls);
		} else if (isArrowKeyPressed(e, topMenu !== null)) {
			const layerEl = getTopMenuEl(topMenu, reactAppId);
			if (!layerEl) return;

			const focusableEls = getFocusableElements(layerEl);
			if (focusableEls.length === 0) return;

			//Prevent default scrolling of the table container
			e.preventDefault();

			const focusedEl = document.activeElement;

			let index = -1;
			if (focusedEl) index = Array.from(focusableEls).indexOf(focusedEl);

			const numVisibleColumns = loomState.model.columns.filter(
				(column) => column.isVisible
			).length;
			const numRows = loomState.model.rows.length;

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
						const numOptionBarFocusableEls =
							getNumOptionBarFocusableEls(layerEl);
						const numBottomBarFocusableEls =
							getNumBottomBarFocusableEl(layerEl);

						elementToFocus = moveFocusUp(
							focusableEls,
							numOptionBarFocusableEls,
							numBottomBarFocusableEls,
							numVisibleColumns,
							numRows,
							index
						);
					}
					break;
				case "ArrowDown":
					if (topMenu !== null) {
						elementToFocus = moveMenuFocusDown(focusableEls, index);
					} else {
						const numOptionBarFocusableEls =
							getNumOptionBarFocusableEls(layerEl);
						const numBottomBarFocusableEls =
							getNumBottomBarFocusableEl(layerEl);

						elementToFocus = moveFocusDown(
							focusableEls,
							numOptionBarFocusableEls,
							numBottomBarFocusableEls,
							numVisibleColumns,
							numRows,
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
		onFocusKeyDown: handleKeyDown,
	};
}
