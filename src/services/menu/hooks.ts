import { useRef, useState } from "react";
import { Menu } from "./types";
import { randomUUID } from "crypto";

export const useMenu = (level: number, sortRowsOnClose = false): Menu => {
	const [id] = useState("m" + randomUUID());
	return {
		id,
		level,
		sortRowsOnClose,
	};
};

export const usePosition = () => {
	const containerRef = useRef<any | null>(null);

	let position = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};

	if (containerRef.current) {
		const node = containerRef.current as HTMLElement;
		const { top: nodeTop, left: nodeLeft } = node.getBoundingClientRect();
		//We use offsetWidth, and offsetHeight instead of the width and height of the rectangle
		//because we want whole values to match what we set as the column width.
		//This will make sure that the rendered cell and the input cell are the same size
		const { offsetWidth, offsetHeight } = node;
		position = {
			width: offsetWidth,
			height: offsetHeight,
			top: nodeTop,
			left: nodeLeft,
		};
	}

	return { containerRef, position };
};
