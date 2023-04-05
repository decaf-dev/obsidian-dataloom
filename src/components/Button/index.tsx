import React from "react";

import "./styles.css";

interface Props {
	id?: string;
	isSimple?: boolean;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
}

export default function Button({ children, icon, isSimple, onClick }: Props) {
	let className = "NLT__button";
	if (icon !== undefined) className += " NLT__button--icon";
	if (isSimple) className += " NLT__button--simple";

	return (
		<button className={className} onClick={(e) => onClick(e)}>
			{icon !== undefined ? icon : children}
		</button>
	);
}
