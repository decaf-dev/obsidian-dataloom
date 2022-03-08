import React from "react";

import { CELL_COLOR } from "../../constants";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.css";

export default function TagCell({
	content = "",
	hide = false,
	color = CELL_COLOR.RED,
	showClose = false,
	selectable = false,
	onRemoveClick = null,
	onClick = null,
}) {
	let className = "NLT__tag-cell";
	if (color === CELL_COLOR.RED) {
		className += " NLT__tag-cell--red";
	} else if (color === CELL_COLOR.YELLOW) {
		className += " NLT__tag-cell--yellow";
	} else if (color === CELL_COLOR.ORANGE) {
		className += " NLT__tag-cell--orange";
	} else if (color === CELL_COLOR.PINK) {
		className += " NLT__tag-cell--pink";
	} else if (color === CELL_COLOR.PURPLE) {
		className += " NLT__tag-cell--purple";
	} else if (color === CELL_COLOR.GRAY) {
		className += " NLT__tag-cell--gray";
	}

	if (selectable) className += " NLT__selectable";

	if (hide) return <></>;

	return (
		<div className={className} onClick={onClick}>
			<div>{content}</div>
			{showClose && (
				<CloseIcon
					className="NLT__icon--md NLT__margin-left"
					onClick={onRemoveClick}
				/>
			)}
		</div>
	);
}
