import { LoomMenu } from "src/react/shared/menu/types";

/**
 * Adds the dataloom-focus-visible class to an element
 * We do this since because want to control the focus-visible class to appear when enter is pressed or we
 * click outside of the element
 * @param el - The element to add the focus-visible class to
 * @returns
 */
export const addFocusClass = (el: HTMLElement | null) => {
	if (!el) return;
	el.classList.add("dataloom-focus-visible");
};

/**
 * Removes the dataloom-focus-visible class from an element
 * There should only be one element with this class at a time
 */
export const removeCurrentFocusClass = () => {
	const el = document.querySelector(".dataloom-focus-visible");
	if (!el) return;
	el.classList.remove("dataloom-focus-visible");
};

/**
 * Gets the top menu element.
 * If the top menu is null, then we return the app element.
 * @param appId - The id of the app instance
 */
export const getTopMenuEl = (
	topMenu: LoomMenu | null,
	appId: string
): HTMLElement | null => {
	if (topMenu) return document.getElementById(topMenu.id);
	return document.getElementById(appId);
};

export const focusNextElement = (
	layerEl: HTMLElement,
	focusableEls: NodeListOf<Element>
) => {
	const focusedEl = document.activeElement;

	//If there's an element that's focused, get the next element
	if (focusedEl) {
		const currentIndex = Array.from(focusableEls).indexOf(focusedEl);
		if (currentIndex !== -1) {
			let index = currentIndex + 1;
			if (index > focusableEls.length - 1) index = 0;
			(focusableEls[index] as HTMLElement).focus();
			return;
		}
	}

	//Otherwise focus the first element or the selected element
	const selectedEl = layerEl.querySelector(".dataloom-selected");
	if (selectedEl) {
		(selectedEl as HTMLElement).focus();
	} else {
		(focusableEls[0] as HTMLElement).focus();
	}
};

export const getFocusableElements = (el: HTMLElement) => {
	return el.querySelectorAll(".dataloom-focusable");
};

export const getNumOptionBarFocusableEls = (appEl: HTMLElement) => {
	const el = appEl.querySelector(
		".dataloom-option-bar"
	) as HTMLElement | null;
	if (!el) throw Error("No option bar found");
	return getFocusableElements(el).length;
};

export const getNumBottomBarFocusableEl = (appEl: HTMLElement) => {
	const el = appEl.querySelector(
		".dataloom-bottom-bar"
	) as HTMLElement | null;
	if (!el) throw Error("No bottom bar found");
	return getFocusableElements(el).length;
};

export const isArrowKeyPressed = (
	e: React.KeyboardEvent,
	isMenuOpen: boolean
) => {
	if (isMenuOpen) {
		return e.key === "ArrowDown" || e.key === "ArrowUp";
	}
	return (
		e.key === "ArrowDown" ||
		e.key === "ArrowUp" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight"
	);
};
