import { useState } from "react";
import { Menu } from "./types";
import { randomId } from "../random";
import { MENU_PREFIX } from "./constants";

export const NUM_CHARS_MENU_ID = 8;

const randomMenuId = () => {
	return `${MENU_PREFIX}-${randomId(NUM_CHARS_MENU_ID)}`;
};

export const useMenu = (level: number, sortRowsOnClose?: boolean): Menu => {
	const [id] = useState(randomMenuId());
	return {
		id,
		level,
		sortRowsOnClose,
	};
};
