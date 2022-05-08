import React, { forwardRef } from "react";

import { findIcon } from "src/app/services/icon";
interface Props {
	id?: string;
	selected?: boolean;
	icon: string;
	onClick: (e: React.MouseEvent) => void;
}

const IconButton = forwardRef<HTMLInputElement, Props>(
	({ id = "", selected, icon, onClick }, ref) => {
		let className = "NLT__button NLT__button--reset";
		if (selected) className += " NLT__selected";

		return (
			<button
				tabIndex={-1}
				id={id !== "" ? id : ""}
				className={className}
				ref={ref}
				onClick={(e) => onClick(e)}
			>
				{icon !== "" && findIcon(icon, "NLT__icon--md")}
			</button>
		);
	}
);

export default IconButton;
