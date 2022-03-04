import React, { useState } from "react";

import { ARROW } from "./constants";
import ArrowIcon from "./components/ArrowIcon";

export default function ArrowGroup({ selected, onArrowClick = null }) {
	function handleArrowClick(arrow) {
		if (selected === arrow) {
			onArrowClick(ARROW.NONE);
		} else {
			onArrowClick(arrow);
		}
	}

	return (
		<div className="NLT__grid NLT__grid--gap-sm">
			<ArrowIcon
				up={true}
				selected={selected === ARROW.UP}
				onClick={handleArrowClick}
			/>
			<ArrowIcon
				up={false}
				selected={selected === ARROW.DOWN}
				onClick={handleArrowClick}
			/>
		</div>
	);
}
