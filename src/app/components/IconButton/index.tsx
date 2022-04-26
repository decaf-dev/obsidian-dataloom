import React, { forwardRef } from "react";

import { findIcon } from "../../services/utils";

interface Props {
	id?: string;
	selected?: boolean;
	icon: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = forwardRef<HTMLInputElement, Props>(
	({ id = "", selected, icon, onClick }, ref) => {
		let className = "NLT__button--reset";
		if (selected) className += " NLT__selected";

		return (
			<button
				id={id !== "" ? id : ""}
				className={className}
				ref={ref}
				onClick={onClick}
			>
				{icon !== "" && findIcon(icon, "NLT__icon--md")}
			</button>
		);
	}
);

export default IconButton;
