// export const focusMenuElement = (menuId: string) => {
// 	const el = document.querySelector(`#${menuId}`) as HTMLElement | null;
// 	if (el) {
// 		el.focus();
// 		addFocusClass(el);
// 	}
// };

/**
 * Adds the focus-visible class to an element
 * We do this since because :focus-visible only appears when a keyboard event happens e.g. tab is pressed
 * It will not appear when we click outside of the menu
 * @param el - The element to add the focus-visible class to
 * @returns
 */
export const addFocusClass = (el: HTMLElement | null) => {
	if (!el) return;
	el.classList.add("dataloom-focus-visible");
};

/**
 * Removes the focus-visible class from an element
 * There should only be one element with the focus-visible class at a time
 */
export const removeCurrentFocusClass = () => {
	const el = document.querySelector(".dataloom-focus-visible");
	if (!el) return;
	el.classList.remove("dataloom-focus-visible");
};

export const getFocusableLayerEl = (appId: string): HTMLElement | null => {
	// //Get the parent element
	// const appEl = document.querySelector(`#${appId}`);
	// if (!appEl) return null;
	// let layerEl = appEl;
	// if (topMenu) {
	// 	const { id } = topMenu;
	// 	const menuEl = document.querySelector(
	// 		`.dataloom-menu[data-id="${id}"]`
	// 	);
	// 	if (menuEl) layerEl = menuEl;
	// }
	// return layerEl as HTMLElement;
	console.log(appId);
	return null;
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
