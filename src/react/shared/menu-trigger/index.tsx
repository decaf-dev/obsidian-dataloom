import { css } from "@emotion/react";
import { Menu } from "src/shared/menu/types";
import React from "react";
import { useMenuContext } from "src/shared/menu/menu-context";

interface Props {
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
		if (e.key === "Enter") {
			onEnterDown?.();
		} else if (e.key === "Backspace") {
			onBackspaceDown?.();
		}
	}

	function handleClick(e: React.MouseEvent) {
		console.log("TRIGGER CLICK");
		//Don't propagate to the DOM handler
		//This is important
		e.stopPropagation();
		onClick?.(e);

		//Is the trigger isn't active, just close any open menus on click
		if (!isActive) {
			closeTopMenu();
			return;
		}

		//Otherwise if we can open the menu, open it
		if (canOpenMenu(menu)) {
			openMenu(menu);
			return;
		}

		//Otherwise close the open menu
		closeTopMenu();
	}

	const { id, level, shouldRequestOnClose } = menu;

	return (
		<div
			className="NLT__menu-trigger NLT__focusable"
			css={css`
				width: ${fillParent ? "100%" : "unset"};
				height: ${fillParent ? "100%" : "unset"};
			`}
			tabIndex={0}
			data-menu-id={isActive ? id : undefined}
			data-menu-level={isActive ? level : undefined}
			data-menu-should-request-on-close={
				isActive ? shouldRequestOnClose : undefined
			}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			onMouseDown={onMouseDown}
		>
			{children}
		</div>
	);
};
export default MenuTrigger;
