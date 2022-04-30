import React, { forwardRef } from "react";

import { findIcon } from "../../services/utils";

interface Props {
	id?: string;
	selected?: boolean;
	icon: string;
	onKeyUp: (e: React.KeyboardEvent) => void;
	onClick: () => void;
}

const IconButton = forwardRef<HTMLInputElement, Props>(
	({ id = "", selected, icon, onClick, onKeyUp }, ref) => {
		let className = "NLT__button NLT__button--reset";
		if (selected) className += " NLT__selected";

		return (
			<button
				type="button"
				tabIndex={0}
				id={id !== "" ? id : ""}
				className={className}
				ref={ref}
				onKeyUp={(e) => onKeyUp && onKeyUp(e)}
				onClick={() => onClick()}
			>
				{icon !== "" && findIcon(icon, "NLT__icon--md")}
			</button>
		);
	}
);

export default IconButton;
