import { useMemo, useRef, useState } from "react";
import { MenuPosition, Menu, MenuLevel } from "./types";
import { v4 as uuidv4 } from "uuid";
import { getElementPosition } from "./utils";

const useMenuPosition = (): MenuPosition => {
	const positionRef = useRef<any | null>(null);

	const position = getElementPosition(positionRef.current);
	return { positionRef, position };
};

export const useMenu = (
	level: MenuLevel,
	shouldRequestOnClose = false
): [Menu, MenuPosition] => {
	const menuPosition = useMenuPosition();
	const [id] = useState("m" + uuidv4());

	const menu: Menu = useMemo(() => {
		return { id, level, shouldRequestOnClose };
	}, [id, level, shouldRequestOnClose]);

	return [menu, menuPosition];
};
