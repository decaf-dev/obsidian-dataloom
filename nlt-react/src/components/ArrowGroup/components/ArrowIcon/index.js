import React from "react";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { ARROW } from "../../constants";

export default function ArrowIcon({
	up = false,
	selected = false,
	onClick = null,
}) {
	const style = {
		width: "1rem",
		height: "1rem",
	};

	let className = "NLT__button--reset";
	if (selected) className += " NLT__button--selected";

	return (
		<button
			style={{ height: "1rem" }}
			className={className}
			onClick={() => onClick(up ? ARROW.UP : ARROW.DOWN)}
		>
			{up && <KeyboardArrowUp style={style} />}
			{!up && <KeyboardArrowDown style={style} />}
		</button>
	);
}
