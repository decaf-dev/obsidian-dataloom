import React from "react";

import parse from "html-react-parser";
import CloseIcon from "@mui/icons-material/Close";

import { findColorClass } from "src/services/color";

import "./styles.css";

interface Props {
	isDarkMode: boolean;
	id?: string;
	html: string;
	color: string;
	showRemove?: boolean;
	onRemoveClick?: (tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function Tag({
	isDarkMode,
	id,
	color,
	html,
	showRemove,
	onRemoveClick,
}: Props) {
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(isDarkMode, color);

	return (
		<div className={tagClass}>
			<div className="NLT__tag-content">{parse(html)}</div>
			{showRemove && (
				<CloseIcon
					className="NLT__icon--md NLT__margin-left NLT__icon--selectable"
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						onRemoveClick(id);
					}}
				/>
			)}
		</div>
	);
}
