import React from "react";

import parse from "html-react-parser";

import IconText from "src/app/components/IconText";

import { findColorClass } from "src/app/services/color";

import { ICON } from "src/app/constants";
interface Props {
	id: string;
	content: string;
	color: string;
	onClick: (tagId: string) => void;
}

export default function SelectableTag({ id, content, color, onClick }: Props) {
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(color);
	let cellClass = "NLT__tag-cell NLT__selectable";

	//If we have an empty cell, then don't return anything
	if (content === "") return <></>;

	return (
		<div className={cellClass} onClick={() => onClick(id)}>
			<div className={tagClass}>
				<div className="NLT__tag-content">{parse(content)}</div>
				<IconText icon={ICON.MORE_HORIZ} iconText="" />
			</div>
		</div>
	);
}
