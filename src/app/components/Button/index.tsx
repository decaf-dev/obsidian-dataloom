import React from "react";

import "./styles.css";

interface Props {
	id?: string;
	style?: object;
	hasIcon?: boolean;
	children: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
}

export default function Button({
	id,
	style,
	children,
	hasIcon,
	onClick,
}: Props) {
	let className = "NLT__button";
	if (hasIcon) className += " NLT__button--icon";

	const buttonId = id !== "" ? id : "";
	return (
		<button
			id={buttonId}
			style={style}
			className={className}
			tabIndex={-1}
			aria-hidden="true"
			onClick={(e) => onClick(e)}
		>
			{children}
		</button>
	);
}
