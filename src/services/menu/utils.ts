import { RootState } from "../redux/store";

export const isMenuOpen = (state: RootState, menuId: string) =>
	state.menu.openMenus.find((menu) => menu.id === menuId) != null;

export const getCloseMenuRequestTime = (state: RootState, menuId: string) => {
	if (state.menu.menuRequestingClose?.id === menuId) {
		return state.menu.menuRequestingClose.requestTime;
	}
	return null;
};

export const isTopLevelMenu = (state: RootState, menuId: string) =>
	state.menu.openMenus.last()?.id === menuId;
