import { useState } from "react";
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
