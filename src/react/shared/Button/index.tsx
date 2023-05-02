import React from "react";

import "./styles.css";

interface Props {
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
	isSimple,
	onClick,
	onMouseDown,
}: Props) {
	let className = "NLT__button";
	if (icon !== undefined) className += " NLT__button--icon";
	if (isSimple) className += " NLT__button--simple";

	return (
		<button
			className={className}
			aria-label={ariaLabel}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			{icon !== undefined ? icon : children}
		</button>
	);
}
