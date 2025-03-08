import { get, writable } from "svelte/store";

export type MenuLevel = 1 | 2 | 3;

export interface Menu {
	id: string;
	level: MenuLevel;
}

export default class MenuStore {
	private static instance: MenuStore;

	openMenus = writable<Menu[]>([]);

	private constructor() {}

	static getInstance(): MenuStore {
		if (!MenuStore.instance) {
			MenuStore.instance = new MenuStore();
		}
		return MenuStore.instance;
	}

	open(menu: Menu) {
		const menus = get(this.openMenus);
		this.openMenus.set([...menus, menu]);
	}

	close(id: string) {
		const menus = get(this.openMenus);
		this.openMenus.set(menus.filter((menu) => menu.id !== id));
	}

	closeTop() {
		const menus = get(this.openMenus);
		if (menus.length > 0) {
			this.openMenus.set(menus.slice(0, menus.length - 1));
		}
	}

	getTopMenu(): Menu | null {
		const menus = get(this.openMenus);
		return menus.length > 0 ? menus[menus.length - 1] : null;
	}

	canOpen(level: MenuLevel): boolean {
		const menus = get(this.openMenus);
		return menus.length === 0 || menus[menus.length - 1].level < level;
	}
}
