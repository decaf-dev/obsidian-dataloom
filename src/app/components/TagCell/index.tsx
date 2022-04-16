import React from "react";

import parse from "html-react-parser";
import CloseIcon from "@mui/icons-material/Close";

import { CELL_COLOR } from "../../constants";

import "./styles.css";
import { toTagLink } from "src/app/services/utils";
interface Props {
	cellId?: string;
	id?: string;
	content: string;
	hide?: boolean;
	hideLink?: boolean;
	color: string;
	showRemove?: boolean;
	selectable?: boolean;
	isCreate?: boolean;
	showLink?: boolean;
	onRemoveClick?: (cellId: string, tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function TagCell({
	cellId,
	id,
	content,
	color,
	showRemove,
	selectable,
	isCreate,
	showLink = false,
	onRemoveClick,
	onClick,
}: Props) {
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

	//If we have an empty cell, then don't return anything
	if (content === "") return <></>;

	//If on render view, add the link to make it a clickable tag
	if (showLink) content = toTagLink(content);

	return (
		<div
			className={cellClass}
			onClick={(e) => {
				//If we're showing a link, that means we're rendering a tag
				//and we want event propagation since the cell has an on click handler.
				//Otherwise turn off, as without this code the cell menu will not close upon
				//tag click
				if (!showLink) e.stopPropagation();
				onClick && onClick(id);
			}}
		>
			{isCreate && <div>Create&nbsp;</div>}
			<div className={tagClass}>
				<div className="NLT__tag-content">{parse(content)}</div>
				{showRemove && (
					<CloseIcon
						className="NLT__icon--md NLT__margin-left"
						onClick={(e) => {
							e.stopPropagation();
							onRemoveClick(cellId, id);
						}}
					/>
				)}
			</div>
		</div>
	);
}
