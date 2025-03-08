import { isOnMobile } from "src/shared/render-utils";
import type { MenuOpenDirection, MenuPosition } from "./menu.svelte";

export function shiftMenuIntoView(position: MenuPosition) {
	// const viewportEl =
	// const viewportPosition = getViewportPosition(viewportEl, isModalMenu);
	// const newPosition = shiftElementIntoContainer(
	// 	viewportPosition,
	// 	menuPosition
	// );
	// menuRef.current.style.top = numToPx(newPosition.top);
	// menuRef.current.style.left = numToPx(newPosition.left);
	return position;
}

export function shiftMenuByDirection(
	position: MenuPosition,
	topOffset: number,
	leftOffset: number,
	openDirection: MenuOpenDirection
) {
	let top = position.top + topOffset;
	let left = position.left + leftOffset;

	if (openDirection === "left") {
		left = left - position.width;
	} else if (openDirection === "right") {
		left = left + position.width;
	} else if (openDirection === "bottom-left") {
		top = top + position.height;
		left = left - position.width;
	} else if (openDirection === "bottom-right") {
		top = top + position.height;
		left = left + position.width;
	} else if (openDirection === "bottom") {
		top = top + position.height;
	}

	return {
		top,
		left,
		width: position.width,
		height: position.height,
	};
}

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
const getPositionRelativeToDocument = (rect: DOMRect): MenuPosition => {
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
 * @param containerPosition - The container that the element should be shifted into
 * @param elementPosition  - The element that should be shifted into the container
 */
const shiftElementIntoContainer = (
	containerPosition: MenuPosition,
	elementPosition: MenuPosition
) => {
	/**
	 * When a menu is shifted, it will be moved into the view container. This offset
	 * is how much padding we want between the menu and the edge of the view container.
	 */
	const MENU_SHIFT_PADDING = 16;

	let newTop = elementPosition.top;
	let newLeft = elementPosition.left;

	// Shift up if the element is below
	if (
		elementPosition.top + elementPosition.height >
		containerPosition.top + containerPosition.height
	) {
		newTop =
			containerPosition.top +
			containerPosition.height -
			elementPosition.height -
			MENU_SHIFT_PADDING;
	}

	// Shift left if the element is to the right
	if (
		elementPosition.left + elementPosition.width >
		containerPosition.left + containerPosition.width
	) {
		newLeft =
			containerPosition.left +
			containerPosition.width -
			elementPosition.width -
			MENU_SHIFT_PADDING;
	}

	//Shift down if the element is above
	if (elementPosition.top < containerPosition.top) {
		newTop = containerPosition.top + MENU_SHIFT_PADDING;
	}

	//Shift right if the element is to the left
	if (elementPosition.left < containerPosition.left) {
		newLeft = containerPosition.left + MENU_SHIFT_PADDING;
	}

	return {
		top: newTop,
		left: newLeft,
	};
};
