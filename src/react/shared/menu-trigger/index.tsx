import { css } from "@emotion/react";
import React from "react";
import { eventSystem } from "src/shared/event-system/event-system";

interface Props {
	canMenuOpen?: boolean;
	shouldMenuRequestOnClose?: boolean;
	menuId: string;
	children: React.ReactNode;
	onClick: (e: MouseEvent) => void;
	onEnterDown?: () => void;
	onBackspaceDown?: () => void;
}

const MenuTrigger = ({
	canMenuOpen = true,
	shouldMenuRequestOnClose = false,
	children,
	menuId,
	onClick,
	onEnterDown,
	onBackspaceDown,
}: Props) => {
	React.useEffect(() => {
		function handleClick(e: MouseEvent) {
			const target = e.target as HTMLElement;
			if (target.closest(`.NLT__focusable[data-menu-id="${menuId}"]`)) {
				onClick(e);
			}
		}

		eventSystem.addEventListener("click", handleClick, 1);

		return () => {
			eventSystem.removeEventListener("click", handleClick);
		};
	}, [onClick]);

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			onEnterDown?.();
		} else if (e.key === "Backspace") {
			onBackspaceDown?.();
		}
	}

	return (
		<div
			tabIndex={0}
			data-menu-id={canMenuOpen ? menuId : undefined}
			data-menu-should-request-on-close={shouldMenuRequestOnClose}
			className="NLT__focusable"
			css={css`
				width: 100%;
				height: 100%;
			`}
			onKeyDown={handleKeyDown}
		>
			{children}
		</div>
	);
};
export default MenuTrigger;
