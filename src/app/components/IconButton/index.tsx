import React, { forwardRef } from "react";

interface Props {
	selected?: boolean;
	icon: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButton = forwardRef<HTMLInputElement, Props>(
	({ selected = false, icon, onClick }, ref) => {
		let className = "NLT__button--reset";
		if (selected) className += " NLT__selected";

		return (
			<button className={className} ref={ref} onClick={onClick}>
				{icon}
			</button>
		);
	}
);

export default IconButton;
