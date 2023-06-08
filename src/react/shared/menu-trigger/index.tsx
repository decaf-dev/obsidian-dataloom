import { css } from "@emotion/react";
import { Menu } from "src/shared/menu/types";
import React from "react";
import { useMenuContext } from "src/shared/menu/menu-context";
import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";

interface Props {
	isButton?: boolean;
	isActive?: boolean;
	fillParent?: boolean;
	menu: Menu;
	children: React.ReactNode;
	onEnterDown?: () => void;
	onBackspaceDown?: () => void;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

const MenuTrigger = ({
	isButton = false,
	isActive = true,
	fillParent = true,
	menu,
	children,
	onEnterDown,
	onBackspaceDown,
	onClick,
	onMouseDown,
}: Props) => {
	const { openMenu, closeTopMenu, canOpenMenu } = useMenuContext();

	function handleKeyDown(e: React.KeyboardEvent) {
		console.log("MENU TRIGGER KEY DOWN");

		if (e.key === "Enter") {
			e.stopPropagation();
			onEnterDown?.();

			//Stop click event from running
			e.preventDefault();

			//Is the trigger isn't active, return
			if (!isActive) return;

			const tag = (e.target as HTMLElement).tagName;
			if (tag === "A") return;

			if (canOpenMenu(menu)) {
				openMenu(menu);
				return;
			}

			closeTopMenu();
		} else if (e.key === "Backspace") {
			onBackspaceDown?.();
		} else if (e.key.length === 1) {
			if (
				isWindowsRedoDown(e) ||
				isWindowsUndoDown(e) ||
				isMacRedoDown(e) ||
				isMacUndoDown(e)
			)
				return;

			openMenu(menu);
		}
	}

	function handleClick(e: React.MouseEvent) {
		console.log("TRIGGER CLICK");
		//Don't propagate to the DOM handler
		e.stopPropagation();
		onClick?.(e);

		//Is the trigger isn't active, just close any open menus on click
		if (!isActive) {
			closeTopMenu();
			return;
		}

		//Otherwise if we can open the menu, open it
		if (canOpenMenu(menu)) {
			const tag = (e.target as HTMLElement).tagName;
			if (tag === "A") return;

			openMenu(menu);
			return;
		}

		//Otherwise close the open menu
		closeTopMenu();
	}

	const { id } = menu;

	return (
		<div
			className="NLT__menu-trigger NLT__focusable"
			css={css`
				width: ${fillParent ? "100%" : "unset"};
				height: ${fillParent ? "100%" : "unset"};
				border-radius: ${isButton ? "var(--button-radius)" : "unset"};
			`}
			tabIndex={0}
			data-menu-id={isActive ? id : undefined}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			onMouseDown={onMouseDown}
		>
			{children}
		</div>
	);
};
export default MenuTrigger;
