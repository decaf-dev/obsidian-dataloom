import { menuFocusSelector } from "./utils";

export const focusMenuElement = (menuId: string) => {
	const selector = menuFocusSelector(menuId);
	const el = document.querySelector(selector) as HTMLElement | null;
	if (el) el.focus();
};

//Since .focus-visible only appears when a keyboard event happens e.g. tab is pressed
//to programatically add a visual indicator we need to add a class
export const addFocusVisibleClass = (menuId: string) => {
	const selector = menuFocusSelector(menuId);
	const el = document.querySelector(selector) as HTMLElement | null;
	if (el) el.classList.add("NLT__focus-visible");
};

//Once a focus visible class is added, it will stay there until we remove it
export const removeFocusVisibleClass = () => {
	const el = document.querySelector(".NLT__focus-visible");
	if (el) el.classList.remove("NLT__focus-visible");
};
