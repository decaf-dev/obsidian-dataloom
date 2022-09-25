import { useState } from "react";
import { Menu } from "./types";
import { randomId } from "../random";

export const NUM_CHARS_MENU_ID = 8;

const randomMenuId = () => {
	return `NLT__menu-id-${randomId(NUM_CHARS_MENU_ID)}`;
};

export const useMenu = (level: number): Menu => {
	const [id] = useState(randomMenuId());
	return {
		id,
		level,
	};
};
