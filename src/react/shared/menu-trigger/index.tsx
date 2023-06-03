import { css } from "@emotion/react";
import React from "react";
import { eventSystem } from "src/shared/event-system/event-system";
import { useUUID } from "src/shared/hooks";

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
	const id = useUUID();
	React.useEffect(() => {
		function handleClick(e: MouseEvent) {
			console.log("HANDLE CLICK");
			const target = e.target as HTMLElement;
			console.log(target);
			if (target.closest(`.NLT__focusable[data-id="${id}"]`)) {
				onClick(e);
			}
		}

		eventSystem.addEventListener("click", handleClick, 1);

		return () => {
			eventSystem.removeEventListener("click", handleClick);
		};
	}, [id, onClick]);

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
			data-id={id}
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
