import React from "react";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import Sort from "@mui/icons-material/Sort";

import IconButton from "../IconButton";
import { ARROW } from "../../constants";

interface Props {
	selected: string;
	onClick: (arrow: string) => void;
}

export default function SortButton({ selected, onClick = null }: Props) {
	function handleButtonClick(e: React.MouseEvent<HTMLElement>) {
		e.stopPropagation();
		if (selected === ARROW.UP) {
			onClick(ARROW.NONE);
		} else if (selected === ARROW.DOWN) {
			onClick(ARROW.UP);
		} else {
			onClick(ARROW.DOWN);
		}
	}

	function getIcon() {
		if (selected === ARROW.UP) {
			return <KeyboardArrowUp className="NLT__icon--md" />;
		} else if (selected === ARROW.DOWN) {
			return <KeyboardArrowDown className="NLT__icon--md" />;
		} else {
			return <Sort className="NLT__icon--md" />;
		}
	}

	return <IconButton icon={getIcon()} onClick={handleButtonClick} />;
}
