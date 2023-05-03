import React from "react";

interface Props {
	menuId: string;
	children: React.ReactNode;
	onMouseUp: (e: React.MouseEvent) => void;
}

const MenuFocus = ({ children, menuId, onMouseUp }: Props) => {
	return (
		<div
			tabIndex={0}
			data-menu-id={menuId}
			className="NLT__focusable"
			style={{ width: "100%", height: "100%" }}
			onMouseUp={onMouseUp}
		>
			{children}
		</div>
	);
};
export default MenuFocus;
