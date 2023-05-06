import React from "react";

interface Props {
	canMenuOpen?: boolean;
	shouldMenuRequestOnClose?: boolean;
	menuId: string;
	children: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
	onEnterDown?: () => void;
}

const MenuTrigger = ({
	canMenuOpen = true,
	shouldMenuRequestOnClose = false,
	children,
	menuId,
	onClick,
	onEnterDown,
}: Props) => {
	return (
		<div
			tabIndex={0}
			data-menu-id={canMenuOpen ? menuId : undefined}
			data-menu-should-request-on-close={shouldMenuRequestOnClose}
			className="NLT__focusable"
			style={{ width: "100%", height: "100%" }}
			onClick={onClick}
			onKeyDown={(e) => e.key === "Enter" && onEnterDown?.()}
		>
			{children}
		</div>
	);
};
export default MenuTrigger;
