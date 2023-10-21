import React from "react";

import _ from "lodash";

import { getPositionFromEl } from "../menu-provider/utils";
import { PositionUpdateHandler } from "../menu-provider/types";

export const useMenuPosition = (
	isOpen: boolean,
	isParentObsidianModal: boolean,
	onPositionUpdate: PositionUpdateHandler
) => {
	const className = isParentObsidianModal ? "modal" : "view-content";
	const ref = useBasePosition(className, isOpen, onPositionUpdate);
	return ref;
};

const useBasePosition = (
	className: string,
	isOpen: boolean,
	onPositionUpdate: PositionUpdateHandler
) => {
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
			onPositionUpdate(position);
		}

		const ancestors = findAncestorsUntilClassName(positionEl, className);

		if (isOpen) {
			ancestors.forEach((ancestor) => {
				ancestor.addEventListener("scroll", throttleUpdatePosition);
				ancestor.addEventListener("resize", throttleUpdatePosition);
			});
			window.addEventListener("resize", throttleUpdatePosition);

			updatePosition();
		}

		return () => {
			ancestors.forEach((ancestor) => {
				ancestor.removeEventListener("scroll", throttleUpdatePosition);
				ancestor.removeEventListener("resize", throttleUpdatePosition);
			});
			window.removeEventListener("resize", throttleUpdatePosition);
		};
	}, [isOpen, onPositionUpdate]);

	return ref;
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
