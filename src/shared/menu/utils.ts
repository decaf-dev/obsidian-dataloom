import React from "react";
import { Position } from "./types";
import { numToPx } from "../conversion";
import { NLTView } from "src/obsidian/nlt-view";
import { MarkdownView, Platform } from "obsidian";

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

export const useShiftMenu = (
	triggerRef: React.RefObject<HTMLDivElement | null>,
	menuRef: React.RefObject<HTMLDivElement | null>,
	isOpen: boolean,
	options?: {
		openDirection?: "left" | "right" | "normal";
		topOffset?: number;
		leftOffset?: number;
	}
) => {
	React.useEffect(() => {
		function shiftMenuIntoView() {
			if (menuRef.current === null) return;
			if (triggerRef.current === null) return;

			const {
				openDirection = "normal",
				topOffset = 0,
				leftOffset = 0,
			} = options || {};

			const activeView =
				app.workspace.getActiveViewOfType(NLTView) ??
				app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) return;

			const viewContentEl = activeView.contentEl;
			const viewContentRect = viewContentEl.getBoundingClientRect();
			const triggerRefRect = triggerRef.current.getBoundingClientRect();
			const menuRect = menuRef.current.getBoundingClientRect();

			//Calculate the initial position
			const top = triggerRefRect.top + topOffset;
			let left = triggerRefRect.left + leftOffset;

			//Offset by the open direction
			if (openDirection === "left") {
				left = left - menuRect.width;
			} else if (openDirection === "right") {
				left = left + triggerRefRect.width;
			}

			const isMobile = Platform.isMobile;
			let viewContentHeight = viewContentRect.height;
			if (isMobile) viewContentHeight -= 48;
			const position = shiftElementIntoContainer(
				{
					top: viewContentRect.top,
					left: viewContentRect.left,
					width: viewContentRect.width,
					height: viewContentHeight,
				},
				{
					top,
					left,
					width: menuRect.width,
					height: menuRect.height,
				}
			);

			menuRef.current.style.top = numToPx(position.top);
			menuRef.current.style.left = numToPx(position.left);
		}

		if (isOpen) shiftMenuIntoView();
	});
};

export const useMenuTriggerPosition = (): {
	triggerRef: React.MutableRefObject<any | null>;
	triggerPosition: Position;
} => {
	const ref = React.useRef<any | null>(null);
	const position = getElementPosition(ref.current);
	return { triggerRef: ref, triggerPosition: position };
};

const PADDING_OFFSET = 5;

const shiftElementIntoContainer = (
	container: Position,
	element: Position
): {
	top: number;
	left: number;
} => {
	let newTop = element.top;
	let newLeft = element.left;

	// Shift up if the element is below
	if (element.top + element.height > container.top + container.height) {
		newTop =
			container.top + container.height - element.height - PADDING_OFFSET;
	}

	// Shift left if the element is to the right
	if (element.left + element.width > container.left + container.width) {
		newLeft =
			container.left + container.width - element.width - PADDING_OFFSET;
	}

	//Shift down if the element is above
	if (element.top < container.top) {
		newTop = container.top + PADDING_OFFSET;
	}

	//Shift right if the element is to the left
	if (element.left < container.left) {
		newLeft = container.left + PADDING_OFFSET;
	}

	return {
		top: Math.ceil(newTop),
		left: Math.ceil(newLeft),
	};
};
