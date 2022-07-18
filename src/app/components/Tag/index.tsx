import React from "react";

import parse from "html-react-parser";
import CloseIcon from "@mui/icons-material/Close";

import { findColorClass } from "src/app/services/color";

import { stripPound } from "src/app/services/string/strippers";

import "./styles.css";

interface Props {
	id?: string;
	content: string;
	color: string;
	showRemove?: boolean;
	onRemoveClick?: (tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function Tag({
	id,
	color,
	content,
	showRemove,
	onRemoveClick,
}: Props) {
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);

	//If we have an empty cell, then don't return anything
	if (content === "") return <></>;

	content = stripPound(content);

	return (
		<div className={tagClass}>
			<div className="NLT__tag-content">{parse(content)}</div>
			{showRemove && (
				<CloseIcon
					className="NLT__icon--md NLT__margin-left NLT__icon--selectable"
					onClick={(e) => {
						e.stopPropagation();
						onRemoveClick(id);
					}}
				/>
			)}
		</div>
	);
}
