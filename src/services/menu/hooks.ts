import { useEffect, useMemo, useRef, useState } from "react";
import { MenuPosition, Menu, MenuLevel } from "./types";
import { v4 as uuidv4 } from "uuid";
import { getElementPosition, isMenuOpen } from "./utils";
import { useForceUpdate } from "../hooks";
import { useAppSelector } from "../redux/hooks";

const useMenuPosition = (): MenuPosition => {
	const positionRef = useRef<any | null>(null);

	const position = getElementPosition(positionRef.current);
	return { positionRef, position };
};

export const useMenu = (
	level: MenuLevel,
	shouldRequestOnClose = false
): { menu: Menu; menuPosition: MenuPosition; isMenuOpen: boolean } => {
	const [id] = useState("m" + uuidv4());

	const menuPosition = useMenuPosition();
	const isOpen = useAppSelector((state) => isMenuOpen(state, id));

	const [, forceUpdate] = useForceUpdate();

	//Once the menu opens, we need to force an update so that the `shiftMenuIntoViewContent` can calculate the
	//correct position of the menu.
	useEffect(() => {
		if (isOpen) forceUpdate();
	}, [isOpen]);

	const menu: Menu = useMemo(() => {
		return { id, level, shouldRequestOnClose };
	}, [id, level, shouldRequestOnClose]);

	return { menu, menuPosition, isMenuOpen: isOpen };
};
