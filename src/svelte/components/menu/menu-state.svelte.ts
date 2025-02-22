import type { MenuPosition } from "./menu.svelte";

export function createMenuState() {
	let position: MenuPosition = $state({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
	});

	return {
		get position() {
			return position;
		},
		set position(value: MenuPosition) {
			position = value;
		},
	};
}
