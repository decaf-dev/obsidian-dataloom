import React from "react";

import parse from "html-react-parser";
import CloseIcon from "@mui/icons-material/Close";

import { CELL_COLOR } from "../../constants";

import "./styles.css";
import { toTagLink } from "src/app/services/string/toLink";
interface Props {
	cellId?: string;
	id?: string;
	content: string;
	hide?: boolean;
	hideLink?: boolean;
	color: string;
	showRemove?: boolean;
	selectable?: boolean;
	style?: object;
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
	style,
	isCreate,
	showLink = false,
	onRemoveClick,
	onClick,
}: Props) {
	function findTagColorClass(color: string) {
		switch (color) {
			case CELL_COLOR.LIGHT_GRAY:
				return "NLT__tag--light-gray";
			case CELL_COLOR.GRAY:
				return "NLT__tag--gray";
			case CELL_COLOR.BROWN:
				return "NLT__tag--brown";
			case CELL_COLOR.ORANGE:
				return "NLT__tag--orange";
			case CELL_COLOR.YELLOW:
				return "NLT__tag--yellow";
			case CELL_COLOR.GREEN:
				return "NLT__tag--green";
			case CELL_COLOR.BLUE:
				return "NLT__tag--blue";
			case CELL_COLOR.PURPLE:
				return "NLT__tag--purple";
			case CELL_COLOR.PINK:
				return "NLT__tag--pink";
			case CELL_COLOR.RED:
				return "NLT__tag--red";
		}
	}

	let tagClass = "NLT__tag";
	tagClass += " " + findTagColorClass(color);
	let cellClass = "NLT__tag-cell";
	if (selectable) cellClass += " NLT__selectable";

	//If we have an empty cell, then don't return anything
	if (content === "") return <></>;

	//If on render view, add the link to make it a clickable tag
	if (showLink) content = toTagLink(content);

	return (
		<div
			className={cellClass}
			style={style}
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
						className="NLT__icon--md NLT__margin-left NLT__icon--selectable"
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
