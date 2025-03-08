import type { MenuOpenDirection, MenuPosition } from "./menu.svelte";

export function createMenuState() {
	let position: MenuPosition = $state({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
	});
	let direction: MenuOpenDirection = $state("normal");

	return {
		get position() {
			return position;
		},
		set position(value: MenuPosition) {
			position = value;
		},
		get direction() {
			return direction;
		},
		set direction(value: MenuOpenDirection) {
			direction = value;
		},
	};
}
