import { Position } from "./types";

export const getElementPosition = (el: HTMLElement | null): Position => {
	if (el) {
		const { top, left, width, height } = el.getBoundingClientRect();

		//All values are decimals, but our menu system uses whole numbers
		//so we need to round the values.
		//We round up the width and height so that will always be enough room for items
		//otherwise some letters may wrap
		return {
			width: Math.ceil(width),
			height: Math.ceil(height),
			top: Math.ceil(top),
			left: Math.ceil(left),
		};
	}
	return {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};
};

export const shiftMenuIntoViewContent = ({
	menuId,
	menuPositionEl,
	menuPosition,
	openDirection = "normal",
	topOffset = 0,
	leftOffset = 0,
}: {
	menuId: string;
	menuPositionEl: HTMLElement | null;
	menuPosition: Position;
	openDirection?: "left" | "right" | "normal";
	topOffset?: number;
	leftOffset?: number;
}) => {
	let isMenuReady = false;

	//The menuPositionEl will be null on first render since the element is not in the DOM yet
	if (menuPositionEl !== null) {
		//Now we want to make sure that this is within bounds
		const viewContentEl = menuPositionEl.closest(
			".view-content"
		) as HTMLElement;

		const containerPosition = getElementPosition(viewContentEl);

		let menuWidth = menuPosition.width;
		let menuHeight = menuPosition.height;

		//The menu position contains the position of the menu container, not the menu itself
		//This means that the top and left values of the menu will match the menu container,
		//but the width and height may be different, depending on if the menu is set to `max-content`
		//Therefore we need to get those values from the menu itself
		const menu = document.querySelector(
			`.NLT__menu[data-menu-id="${menuId}"]`
		) as HTMLElement | null;

		if (menu) {
			const menuContainerEl = menu.firstChild as HTMLElement;
			const { width, height } = menuContainerEl.getBoundingClientRect();

			menuWidth = Math.ceil(width);
			menuHeight = Math.ceil(height);

			//It takes 2 renders to calculate the correct position for the menu.
			//When you first open the menu, the menu container is set to the width and height of the menuPositionRef.
			//The menu, however, can have a width or height greater than this if `maxContent` is set.
			//Therefore we render the menu with visibility set to hidden. Then we use the useForceUpdate hook to force a re-render.
			//The menu is now available in the DOM and we can progamatically get the width and height of the menu to
			//shift it into the view container.
			isMenuReady = true;
		}

		let top = menuPosition.top + topOffset;
		let left = menuPosition.left + leftOffset;
		if (openDirection === "left") {
			left = menuPosition.left - menuWidth;
		} else if (openDirection === "right") {
			left = menuPosition.left + menuPosition.width;
		}
		return {
			position: moveElementIntoContainer(containerPosition, {
				top,
				left,
				width: menuWidth,
				height: menuHeight,
			}),
			isMenuReady,
		};
	}
	return { position: menuPosition, isMenuReady };
};

const moveElementIntoContainer = (
	containerPosition: Position,
	elementPosition: Position
): Position => {
	// Check if elementPosition is already inside containerPosition
	if (
		elementPosition.top >= containerPosition.top &&
		elementPosition.left >= containerPosition.left &&
		elementPosition.top + elementPosition.height <=
			containerPosition.top + containerPosition.height &&
		elementPosition.left + elementPosition.width <=
			containerPosition.left + containerPosition.width
	) {
		return elementPosition;
	}

	// Shift up if the element is below
	if (
		elementPosition.top + elementPosition.height >
		containerPosition.top + containerPosition.height
	) {
		elementPosition.top =
			containerPosition.top +
			containerPosition.height -
			elementPosition.height;
	}

	// Shift left if the element is to the right
	if (
		elementPosition.left + elementPosition.width >
		containerPosition.left + containerPosition.width
	) {
		elementPosition.left =
			containerPosition.left +
			containerPosition.width -
			elementPosition.width;
	}

	//Shift down if the element is above
	if (elementPosition.top < containerPosition.top) {
		elementPosition.top = containerPosition.top;
	}

	//Shift right if the element is to the left
	if (elementPosition.left < containerPosition.left) {
		elementPosition.left = containerPosition.left;
	}
	return elementPosition;
};
