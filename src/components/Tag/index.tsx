import React from "react";

import parse from "html-react-parser";
import { IconType } from "src/services/icon/types";

import { findColorClass } from "src/services/color";

import "./styles.css";
import Icon from "../Icon";
import Button from "../Button";

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
				<Button
					icon={<Icon icon={IconType.CLOSE} />}
					onClick={(e) => {
						e.stopPropagation();
						onRemoveClick(id);
					}}
				/>
			)}
		</div>
	);
}
