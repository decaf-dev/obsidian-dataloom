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
	//Add onMouseDown to prevent blur event being called in the FocusProvider
	//See: https://github.com/react-toolbox/react-toolbox/issues/1323#issuecomment-656778859
	return (
		<button
			id={buttonId}
			className={className}
			tabIndex={-1}
			aria-hidden="true"
			onMouseDown={(e) => e.preventDefault()}
			onClick={(e) => onClick(e)}
		>
			{children}
		</button>
	);
}
