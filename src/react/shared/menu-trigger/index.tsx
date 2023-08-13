import React from "react";

import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import { useLogger } from "src/shared/logger";
import { useMenuOperations } from "../menu/hooks";
import { LoomMenu } from "../menu/types";

interface Props {
	menu: LoomMenu;
	isButton?: boolean;
	/** If the trigger should open a menu */
	shouldOpenOnTrigger?: boolean;
	/** Should the trigger be 100% width and 100% height of the parent */
	isCell?: boolean;
	children: React.ReactNode;
	onEnterDown?: () => void;
	onBackspaceDown?: () => void;
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
	onOpen: () => void;
}

const MenuTrigger = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			menu,
			isButton = false,
			isCell = false,
			shouldOpenOnTrigger = true,
			children,
			onEnterDown,
			onBackspaceDown,
			onClick,
			onMouseDown,
			onOpen,
		}: Props,
		ref
	) => {
		const logger = useLogger();
		const { onRequestCloseTop, canOpen } = useMenuOperations();

		function handleKeyDown(e: React.KeyboardEvent) {
			logger("MenuTrigger handleKeyDown");

			if (e.key === "Enter") {
				e.stopPropagation();
				onEnterDown?.();

				//Stop click event from running
				e.preventDefault();

				//Is the trigger isn't active, return
				if (shouldOpenOnTrigger) {
					if (canOpen(menu)) {
						const tag = (e.target as HTMLElement).tagName;
						if (tag === "A") return;
						onOpen();
						return;
					}
				}

				onRequestCloseTop();
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

				onOpen();
			}
		}

		function handleClick(e: React.MouseEvent) {
			logger("MenuTrigger handleClick");
			//Don't propagate to the app or global event handlers
			e.stopPropagation();
			onClick?.(e);

			if (shouldOpenOnTrigger) {
				if (canOpen(menu)) {
					const tag = (e.target as HTMLElement).tagName;
					if (tag === "A") return;
					onOpen();
					return;
				}
			}

			onRequestCloseTop();
		}

		return (
			<div
				tabIndex={0}
				className="dataloom-menu-trigger dataloom-focusable"
				ref={ref}
				style={{
					width: isCell ? "100%" : undefined,
					height: isCell ? "100%" : undefined,
					borderRadius: isButton ? "var(--button-radius)" : undefined,
				}}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				onMouseDown={onMouseDown}
			>
				{children}
			</div>
		);
	}
);

export default MenuTrigger;
