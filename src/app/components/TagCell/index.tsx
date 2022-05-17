import React from "react";

import parse from "html-react-parser";
import CloseIcon from "@mui/icons-material/Close";

import { findColorClass } from "src/app/services/color";
import { toTagLink } from "src/app/services/string/toLink";

import "./styles.css";
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
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);
	let cellClass = "NLT__tag-cell";
	if (selectable) cellClass += " NLT__selectable";

	//If we have an empty cell, then don't return anything
	if (content === "") return <></>;

	//If on render view, add the link to make it a clickable tag
	if (showLink) {
		if (content.startsWith("#")) content = toTagLink(content);
	}

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
