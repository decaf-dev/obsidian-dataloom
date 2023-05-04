import React from "react";

interface Props {
	menuId: string;
	children: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
}

const MenuFocus = ({ children, menuId, onClick }: Props) => {
	return (
		<div
			tabIndex={0}
			data-menu-id={menuId}
			className="NLT__focusable"
			style={{ width: "100%", height: "100%" }}
			onClick={onClick}
		>
			{children}
		</div>
	);
};
export default MenuFocus;
