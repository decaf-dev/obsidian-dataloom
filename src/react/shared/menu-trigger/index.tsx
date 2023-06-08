import { css } from "@emotion/react";
import { NltMenu } from "src/shared/menu/types";
import React from "react";
import { useMenuState } from "src/shared/menu/menu-context";
import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import { useLogger } from "src/shared/logger";

interface Props {
	/** If the trigger wraps a button */
	isButton?: boolean;
	/** If the trigger should open a menu */
	shouldRun?: boolean;
	/** Should the trigger be 100% width and 100% height of the parent */
	isCell?: boolean;
	menu: NltMenu;
	children: React.ReactNode;
	onEnterDown?: () => void;
	onBackspaceDown?: () => void;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

const MenuTrigger = ({
	isButton = false,
	isCell = false,
	shouldRun = true,
	menu,
	children,
	onEnterDown,
	onBackspaceDown,
	onClick,
	onMouseDown,
}: Props) => {
	const { openMenu, closeTopMenu, canOpenMenu } = useMenuState();
	const logger = useLogger();

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("MenuTrigger handleKeyDown");

		if (e.key === "Enter") {
			e.stopPropagation();
			onEnterDown?.();

			//Stop click event from running
			e.preventDefault();

			//Is the trigger isn't active, return
			if (!shouldRun) return;

			const tag = (e.target as HTMLElement).tagName;
			if (tag === "A") return;

			if (canOpenMenu(menu)) {
				openMenu(menu);
				return;
			}

			closeTopMenu();
		} else if (e.key === "Backspace") {
			onBackspaceDown?.();
		}

		if (e.key.length === 1) {
			if (
				isWindowsRedoDown(e) ||
				isWindowsUndoDown(e) ||
				isMacRedoDown(e) ||
				isMacUndoDown(e)
			)
				return;

			//Unless the trigger is for a cell, don't open it when a user presses any key
			if (!isCell) return;

			openMenu(menu);
		}
	}

	function handleClick(e: React.MouseEvent) {
		logger("MenuTrigger handleClick");
		//Don't propagate to the DOM handler
		e.stopPropagation();
		onClick?.(e);

		//Is the trigger isn't active, just close any open menus on click
		if (!shouldRun) {
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
				width: ${isCell ? "100%" : "unset"};
				height: ${isCell ? "100%" : "unset"};
				border-radius: ${isButton ? "var(--button-radius)" : "unset"};
			`}
			tabIndex={0}
			data-menu-id={shouldRun ? id : undefined}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			onMouseDown={onMouseDown}
		>
			{children}
		</div>
	);
};
export default MenuTrigger;
