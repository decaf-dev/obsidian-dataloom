import React from "react";

import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import { useLogger } from "src/shared/logger";

interface Props {
	canOpen?: boolean;
	isButton?: boolean;
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
			isButton = false,
			isCell = false,
			canOpen = true,
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

		function handleKeyDown(e: React.KeyboardEvent) {
			logger("MenuTrigger handleKeyDown");

			if (e.key === "Enter") {
				e.stopPropagation();
				onEnterDown?.();

				//Stop click event from running
				e.preventDefault();

				//Is the trigger isn't active, return
				if (canOpen) {
					const tag = (e.target as HTMLElement).tagName;
					if (tag === "A") return;
					onOpen();
				}
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

			if (canOpen) {
				const tag = (e.target as HTMLElement).tagName;
				if (tag === "A") return;
				onOpen();
				return;
			}
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
				onMouseDown={onMouseDown}
				onKeyDown={handleKeyDown}
				onClick={handleClick}
			>
				{children}
			</div>
		);
	}
);

export default MenuTrigger;
