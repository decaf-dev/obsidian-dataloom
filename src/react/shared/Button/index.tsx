import React from "react";

import "./styles.css";

interface Props {
	menuId?: string;
	isSimple?: boolean;
	ariaLabel?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
}

export default function Button({
	children,
	ariaLabel = "",
	icon,
	menuId,
	isSimple,
	onClick,
	onMouseDown,
}: Props) {
	let className = "NLT__button NLT__focusable";
	if (icon !== undefined) className += " NLT__button--icon";
	if (isSimple) className += " NLT__button--simple";

	return (
		<button
			className={className}
			aria-label={ariaLabel}
			data-menu-id={menuId}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
}
