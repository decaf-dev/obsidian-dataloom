import React from "react";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

import IconButton from "../IconButton";
import { ARROW } from "../../constants";

export default function ArrowGroup({ selected, onArrowClick = null }) {
	function handleArrowClick(arrow) {
		if (selected === arrow) {
			onArrowClick(ARROW.NONE);
		} else {
			onArrowClick(arrow);
		}
	}

	return (
		<div className="NLT__icon-group">
			<IconButton
				selected={selected === ARROW.UP}
				icon={<KeyboardArrowUp className="NLT__icon--md" />}
				onClick={() => handleArrowClick(ARROW.UP)}
			/>
			<IconButton
				selected={selected === ARROW.DOWN}
				icon={<KeyboardArrowDown className="NLT__icon--md" />}
				onClick={() => handleArrowClick(ARROW.DOWN)}
			/>
		</div>
	);
}
