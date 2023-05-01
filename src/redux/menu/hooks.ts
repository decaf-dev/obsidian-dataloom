import { useEffect, useMemo, useRef, useState } from "react";
import { MenuPosition, Menu, MenuLevel } from "./types";
import { v4 as uuidv4 } from "uuid";
import { getElementPosition, isMenuOpen } from "./utils";
import { useCompare } from "../../shared/hooks";
import { useAppSelector } from "../global/hooks";

const useMenuPosition = (): MenuPosition => {
	const positionRef = useRef<any | null>(null);

	const position = getElementPosition(positionRef.current);
	return { positionRef, position };
};

export const useMenu = (level: MenuLevel, shouldRequestOnClose = false) => {
	const [id] = useState("m" + uuidv4());

	const menuPosition = useMenuPosition();
	const isOpen = useAppSelector((state) => isMenuOpen(state, id));

	const [isVisible, setVisible] = useState(false);

	//Once the menu opens, we need to force an update so that the `shiftMenuIntoViewContent` can calculate the
	//correct position of the menu.
	const hasOpenChanged = useCompare(isOpen);
	useEffect(() => {
		if (hasOpenChanged) {
			if (isOpen) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		}
	}, [isOpen, hasOpenChanged]);

	const menu: Menu = useMemo(() => {
		return { id, level, shouldRequestOnClose };
	}, [id, level, shouldRequestOnClose]);

	return { menu, menuPosition, isMenuOpen: isOpen, isMenuVisible: isVisible };
};
