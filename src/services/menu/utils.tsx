import { MENU_PREFIX } from "./constants";

export const isMenuId = (id: string) => {
	return id.includes(MENU_PREFIX);
};
