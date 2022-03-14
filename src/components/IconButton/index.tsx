import React, { forwardRef } from "react";

const IconButton = forwardRef(
	({ selected = false, icon = null, onClick = null }, ref) => {
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
