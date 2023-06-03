export const isEventForThisApp = (appId: string) => {
	const activeEl = document.activeElement;
	if (!activeEl) return false;

	//If we have an active element that part of the app, then compare the id
	const appEl = activeEl.closest(".NLT__app");
	if (appEl) return appEl.getAttribute("data-id") === appId;

	//Otherwise we have an active element that is part of a menu. That means that it is rendered
	//in a portal. To get the app id, we first need to get the menu, then the menu trigger, then the app
	const menuEl = activeEl.closest(".NLT__menu");
	if (menuEl) {
		const menuId = menuEl.getAttribute("data-id");
		const menuTrigger = document.querySelector(
			`[data-menu-id="${menuId}"]`
		);
		console.log(menuTrigger);
		if (!menuTrigger) return false;
		const appEl = menuTrigger.closest(".NLT__app");
		if (appEl) return appEl.getAttribute("data-id") === appId;
	}
	return false;
};