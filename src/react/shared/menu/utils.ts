import React from "react";

import { numToPx } from "src/shared/conversion";
import { LoomMenuOpenDirection, Position } from "./types";
import { isOnMobile } from "src/shared/render-utils";

export const useShiftMenu = (
	isModalMenu: boolean,
	viewportEl: HTMLElement,
	menuRef: React.RefObject<HTMLDivElement | null>,
	triggerPosition: Position,
	isOpen: boolean,
	options?: {
		openDirection?: LoomMenuOpenDirection;
		topOffset?: number;
		leftOffset?: number;
	}
) => {
	const {
		openDirection = "normal",
		topOffset = 0,
		leftOffset = 0,
	} = options || {};

	React.useEffect(() => {
		if (!menuRef.current) return;
		if (!isOpen) return;

		const menuPosition = getMenuPosition(
			menuRef.current,
			triggerPosition,
			topOffset,
			leftOffset,
			openDirection
		);
		const viewportPosition = getViewportPosition(viewportEl, isModalMenu);

		const newPosition = shiftElementIntoContainer(
			viewportPosition,
			menuPosition
		);

		menuRef.current.style.top = numToPx(newPosition.top);
		menuRef.current.style.left = numToPx(newPosition.left);
	});
};

const getMenuPosition = (
	menuEl: HTMLElement,
	triggerPosition: Position,
	topOffset: number,
	leftOffset: number,
	openDirection: LoomMenuOpenDirection
) => {
	const rect = menuEl.getBoundingClientRect();

	let top = triggerPosition.top + topOffset;
	let left = triggerPosition.left + leftOffset;

	if (openDirection === "left") {
		left = left - rect.width;
	} else if (openDirection === "right") {
		left = left + triggerPosition.width;
	} else if (openDirection === "bottom-left") {
		top = top + triggerPosition.height;
		left = left - rect.width;
	} else if (openDirection === "bottom-right") {
		top = top + triggerPosition.height;
		left = left + triggerPosition.width;
	} else if (openDirection === "bottom") {
		top = top + triggerPosition.height;
		left = left + rect.width;
	}

	return {
		top,
		left,
		width: rect.width,
		height: rect.height,
	};
};

const getViewportPosition = (viewportEl: HTMLElement, isModalMenu: boolean) => {
	const rect = viewportEl.getBoundingClientRect();
	const rectRelativeToDocument = getPositionRelativeToDocument(rect);

	let height = rectRelativeToDocument.height;
	if (!isModalMenu) {
		const MOBILE_BAR_HEIGHT = 48;
		if (isOnMobile()) height -= MOBILE_BAR_HEIGHT;
	}

	return {
		top: rectRelativeToDocument.top,
		left: rectRelativeToDocument.left,
		width: rectRelativeToDocument.width,
		height,
	};
};

/**
 * Gets the position of an element relative to the document.
 * The values returned by getBoundingClientRect() are relative to the viewport, not the document.
 * So if the page is scrolled, the values will reflect the position relative to the visible part of the page,
 * not its absolute position in the document.
 */
const getPositionRelativeToDocument = (rect: DOMRect): Position => {
	const left = rect.left + window.scrollX - document.body.clientLeft;
	const top = rect.top + window.scrollY - document.body.clientTop;
	return {
		top,
		left,
		width: rect.width,
		height: rect.height,
	};
};

/**
 * If the element is outside of the container, shift it into the container.
 * @param container - The container that the element should be shifted into
 * @param element  - The element that should be shifted into the container
 */
const shiftElementIntoContainer = (container: Position, element: Position) => {
	/**
	 * When a menu is shifted, it will be moved into the view container. This offset
	 * is how much padding we want between the menu and the edge of the view container.
	 */
	const MENU_SHIFT_PADDING = 16;

	let newTop = element.top;
	let newLeft = element.left;

	// Shift up if the element is below
	if (element.top + element.height > container.top + container.height) {
		newTop =
			container.top +
			container.height -
			element.height -
			MENU_SHIFT_PADDING;
	}

	// Shift left if the element is to the right
	if (element.left + element.width > container.left + container.width) {
		newLeft =
			container.left +
			container.width -
			element.width -
			MENU_SHIFT_PADDING;
	}

	//Shift down if the element is above
	if (element.top < container.top) {
		newTop = container.top + MENU_SHIFT_PADDING;
	}

	//Shift right if the element is to the left
	if (element.left < container.left) {
		newLeft = container.left + MENU_SHIFT_PADDING;
	}

	return {
		top: newTop,
		left: newLeft,
	};
};
