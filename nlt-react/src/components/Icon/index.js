import React, { forwardRef } from "react";

const Icon = forwardRef(
	({ selected = false, icon = null, onClick = null }, ref) => {
		let className = "NLT__button--reset";
		if (selected) className += " NLT__button--selected";

		return (
			<button className={className} ref={ref} onClick={onClick}>
				{icon}
			</button>
		);
	}
);

export default Icon;
