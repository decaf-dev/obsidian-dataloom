import { NltMenu } from "./types";

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
	if (el) el.classList.add("NLT__focus-visible");
};

//Once a focus visible class is added, it will stay there until we remove it
export const removeFocusVisibleClass = () => {
	const el = document.querySelector(".NLT__focus-visible");
	if (el) el.classList.remove("NLT__focus-visible");
};

export const getFocusableLayerEl = (
	appId: string,
	topMenu: NltMenu | null
): HTMLElement | null => {
	//Get the parent element
	const appEl = document.querySelector(`.NLT__app[data-id="${appId}"]`);
	if (!appEl) return null;

	let layerEl = appEl;
	if (topMenu) {
		const { id } = topMenu;

		const menuEl = document.querySelector(`.NLT__menu[data-id="${id}"]`);
		if (menuEl) layerEl = menuEl;
	}
	return layerEl as HTMLElement;
};

export const focusNextElement = (
	layerEl: HTMLElement,
	focusableEls: NodeListOf<Element>
) => {
	const focusedEl = document.activeElement;

	if (focusedEl) {
		const index = Array.from(focusableEls).indexOf(focusedEl);
		if (index !== -1) {
			if (index + 1 > focusableEls.length - 1) {
				const el = focusableEls[0] as HTMLElement;
				el.focus();
				addFocusVisibleClass(el);
			} else {
				const el = focusableEls[index + 1] as HTMLElement;
				el.focus();
				addFocusVisibleClass(el);
			}
			return;
		}
	}

	const selectedEl = layerEl.querySelector(".NLT__selected");
	//If there is a selected element, focus it
	//otherwise focus the first element
	if (selectedEl) {
		const el = selectedEl as HTMLElement;
		el.focus();
		addFocusVisibleClass(el);
	} else {
		const el = focusableEls[0] as HTMLElement;
		el.focus();
		addFocusVisibleClass(el);
	}
};
