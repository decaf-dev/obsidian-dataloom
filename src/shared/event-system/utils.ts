export const isEventForThisApp = (
	appId: string,
	allowOutsideEvents = false
) => {
	const activeEl = document.activeElement;
	if (!activeEl) return false;

	//If we have an active element that part of the app, then compare the id
	const appEl = activeEl.closest(".DataLoom_app");
	if (appEl) return appEl.getAttribute("data-id") === appId;

	//We will pass on events that are outside of an app instance
	if (allowOutsideEvents) return true;

	//Otherwise we have an active element that is part of a menu. That means that it is rendered
	//in a portal. To get the app id, we first need to get the menu, then the menu trigger, then the app
	const menuEl = activeEl.closest(".DataLoom_menu");
	if (menuEl) {
		const menuId = menuEl.getAttribute("data-id");
		const menuTrigger = document.querySelector(
			`[data-menu-id="${menuId}"]`
		);
		if (!menuTrigger) return false;
		const appEl = menuTrigger.closest(".DataLoom_app");
		if (appEl) return appEl.getAttribute("data-id") === appId;
	}
	return false;
};
