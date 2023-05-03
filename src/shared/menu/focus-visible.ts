export const addFocusVisibleClass = (id: string) => {
	const el = document.querySelector(
		`.NLT__focusable[data-menu-id="${id}" ]`
	) as HTMLElement;
	if (el) {
		el.focus();
		//Since .focus-visible only appears when a keyboard event happens (tab is pressed)
		//we have to programatically add a visible indicator
		//el.focus() will focus the element but not show anything
		el.classList.add("NLT__focus-visible");
	}
};

export const removeFocusVisibleClass = () => {
	const el = document.querySelector(".NLT__focus-visible");
	if (el) el.classList.remove("NLT__focus-visible");
};
