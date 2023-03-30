import { useState } from "react";
import { Menu } from "./types";
import { randomUUID } from "crypto";

export const useMenu = (level: number, sortRowsOnClose?: boolean): Menu => {
	const [id] = useState(randomUUID());
	return {
		id,
		level,
		sortRowsOnClose,
	};
};
