import React from "react";

import { CELL_COLOR } from "../../constants";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.css";

export default function TagCell({
	id = "",
	content = "",
	hide = false,
	color = CELL_COLOR.RED,
	showRemove = false,
	selectable = false,
	isCreate = false,
	onRemoveClick = null,
	onClick = null,
}) {
	let tagClass = "NLT__tag";
	if (color === CELL_COLOR.RED) {
		tagClass += " NLT__tag--red";
	} else if (color === CELL_COLOR.YELLOW) {
		tagClass += " NLT__tag--yellow";
	} else if (color === CELL_COLOR.ORANGE) {
		tagClass += " NLT__tag--orange";
	} else if (color === CELL_COLOR.PINK) {
		tagClass += " NLT__tag--pink";
	} else if (color === CELL_COLOR.PURPLE) {
		tagClass += " NLT__tag--purple";
	} else if (color === CELL_COLOR.GRAY) {
		tagClass += " NLT__tag--gray";
	}

	let cellClass = "NLT__tag-cell";
	if (selectable) cellClass += " NLT__selectable";

	if (hide) return <></>;

	return (
		<div className={cellClass} onClick={onClick}>
			{isCreate && <div>Create</div>}
			<div className={tagClass}>
				<div>{content}</div>
				{showRemove && (
					<CloseIcon
						className="NLT__icon--md NLT__margin-left"
						onClick={() => onRemoveClick(id)}
					/>
				)}
			</div>
		</div>
	);
}
