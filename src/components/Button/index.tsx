import React from "react";

import "./styles.css";

interface Props {
	id?: string;
	isFlat?: boolean;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
}

export default function Button({ children, icon, isFlat, onClick }: Props) {
	let className = "NLT__button";
	if (icon !== undefined) className += " NLT__button--icon";
	if (isFlat) className += " NLT__button--flat";

	return (
		<button className={className} onClick={(e) => onClick(e)}>
			{icon !== undefined ? icon : children}
		</button>
	);
}
