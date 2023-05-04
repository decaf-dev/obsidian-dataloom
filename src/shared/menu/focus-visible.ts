import { FOCUS_VISIBLE_CLASS_NAME } from "./constants";
import { menuFocusSelector } from "./utils";

//Since .focus-visible only appears when a keyboard event happens e.g. tab is pressed
//to programatically add a visual indicator we need to add a class
export const addFocusVisibleClass = (menuId: string) => {
	const selector = menuFocusSelector(menuId);
	const el = document.querySelector(selector) as HTMLElement | null;
	if (el) {
		el.focus();
		el.classList.add(FOCUS_VISIBLE_CLASS_NAME);
	}
};

//Once a focus visible class is added, it will stay there until we remove it
export const removeFocusVisibleClass = () => {
	const el = document.querySelector(`.${FOCUS_VISIBLE_CLASS_NAME}`);
	if (el) el.classList.remove(FOCUS_VISIBLE_CLASS_NAME);
};
