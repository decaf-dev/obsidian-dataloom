import { css } from "@emotion/react";
import { Menu } from "src/shared/menu/types";
import React from "react";

interface Props {
	canMenuOpen?: boolean;
	menu: Menu;
	children: React.ReactNode;
	onEnterDown?: () => void;
	onBackspaceDown?: () => void;
	onClick?: (e: React.MouseEvent) => void;
}

const MenuTrigger = ({
	canMenuOpen = true,
	menu,
	children,
	onEnterDown,
	onBackspaceDown,
	onClick,
}: Props) => {
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			onEnterDown?.();
		} else if (e.key === "Backspace") {
			onBackspaceDown?.();
		}
	}

	function handleClick(e: React.MouseEvent) {
		onClick?.(e);
	}

	const { id, level, shouldRequestOnClose } = menu;

	return (
		<div
			className="NLT__focusable"
			css={css`
				width: 100%;
				height: 100%;
			`}
			tabIndex={0}
			data-menu-id={canMenuOpen ? id : undefined}
			data-menu-level={canMenuOpen ? level : undefined}
			data-menu-should-request-on-close={shouldRequestOnClose}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			{children}
		</div>
	);
};
export default MenuTrigger;
