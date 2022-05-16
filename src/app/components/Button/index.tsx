import React from "react";

import "./styles.css";

interface Props {
	id?: string;
	noPadding?: boolean;
	children: React.ReactNode;
	onClick: (e: React.MouseEvent) => void;
}

export default function Button({ id, children, noPadding, onClick }: Props) {
	let className = "NLT__button";
	if (noPadding) className += " NLT__button--reset";

	let buttonId = id !== "" ? id : "";
	return (
		<button
			id={buttonId}
			className={className}
			tabIndex={-1}
			aria-hidden="true"
			onClick={(e) => onClick(e)}
		>
			{children}
		</button>
	);
}
