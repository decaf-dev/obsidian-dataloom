import React from "react";

import "./styles.css";

interface Props {
	id?: string;
	style?: object;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	isDarker?: boolean;
	onClick: (e: React.MouseEvent) => void;
}

export default function Button({
	style,
	children,
	icon,
	isDarker,
	onClick,
}: Props) {
	let className = "NLT__button";
	if (icon) className += " NLT__button--icon";
	if (isDarker) className += " NLT__button--icon-darker";

	return (
		<button style={style} className={className} onClick={(e) => onClick(e)}>
			{icon ? icon : children}
		</button>
	);
}
