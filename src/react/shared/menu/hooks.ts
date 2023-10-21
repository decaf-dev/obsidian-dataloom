import React from "react";

import _ from "lodash";

import { LoomMenuPosition } from "./types";
import { getPositionFromEl } from "../menu-provider/utils";

export const useMenuPosition = (
	isOpen: boolean,
	isParentObsidianModal: boolean
) => {
	const className = isParentObsidianModal ? "modal" : "view-content";
	const position = useBasePosition(className, isOpen);
	return position;
};

const useBasePosition = (className: string, isOpen: boolean) => {
	const [position, setPosition] = React.useState<LoomMenuPosition>({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!ref.current) return;
		const positionEl = ref.current;

		const THROTTLE_TIME_MILLIS = 50;
		const throttleUpdatePosition = _.throttle(
			updatePosition,
			THROTTLE_TIME_MILLIS
		);

		function updatePosition() {
			const position = getPositionFromEl(positionEl);
			setPosition(position);
		}

		function handleScroll(e: Event) {
			//console.log("handleScroll", e.target);
			throttleUpdatePosition();
		}

		function handleResize(e: Event) {
			//console.log("handleResize", e.target);
			throttleUpdatePosition();
		}

		function handleWindowResize() {
			//console.log("handleWindowResize");
			throttleUpdatePosition();
		}

		const ancestors = findAncestorsUntilClassName(positionEl, className);

		if (isOpen) {
			ancestors.forEach((ancestor) => {
				ancestor.addEventListener("scroll", handleScroll);
				ancestor.addEventListener("resize", handleResize);
			});
			window.addEventListener("resize", handleWindowResize);

			updatePosition();
		}

		return () => {
			ancestors.forEach((ancestor) => {
				ancestor.removeEventListener("scroll", handleScroll);
				ancestor.removeEventListener("resize", handleResize);
			});
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [isOpen]);

	return {
		ref,
		position,
	};
};

const findAncestorsUntilClassName = (
	currentEl: HTMLElement,
	className: string
) => {
	const ancestors: HTMLElement[] = [];
	let el: HTMLElement | null = currentEl;

	while (el && !el.classList.contains(className)) {
		ancestors.push(el);
		el = el.parentElement;
	}
	return ancestors;
};
