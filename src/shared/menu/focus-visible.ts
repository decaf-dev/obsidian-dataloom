import { LoomMenu } from "./types";

export const focusMenuElement = (menuId: string) => {
	const el = document.querySelector(
		`[data-menu-id="${menuId}"]`
	) as HTMLElement | null;
	if (el) {
		el.focus();
		addFocusVisibleClass(el);
	}
};

//Since .focus-visible only appears when a keyboard event happens e.g. tab is pressed
//to programatically add a visual indicator we need to add a class
export const addFocusVisibleClass = (el: HTMLElement) => {
	if (el) el.classList.add("dataloom-focus-visible");
};

//Once a focus visible class is added, it will stay there until we remove it
export const removeFocusVisibleClass = () => {
	const el = document.querySelector(".dataloom-focus-visible");
	if (el) el.classList.remove("dataloom-focus-visible");
};

export const getFocusableLayerEl = (
	appId: string,
	topMenu: LoomMenu | null
): HTMLElement | null => {
	//Get the parent element
	const appEl = document.querySelector(`.dataloom-app[data-id="${appId}"]`);
	if (!appEl) return null;

	let layerEl = appEl;
	if (topMenu) {
		const { id } = topMenu;

		const menuEl = document.querySelector(
			`.dataloom-menu[data-id="${id}"]`
		);
		if (menuEl) layerEl = menuEl;
	}
	return layerEl as HTMLElement;
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
