import React from "react";

import IconText from "../../../IconText";

import { Icon } from "src/app/services/icon/types";

interface Props {
	icon?: Icon | null;
	content: string;
	onClick: any;
	selected?: boolean;
}
export default function HeaderMenuItem({
	icon,
	content,
	onClick,
	selected = false,
}: Props) {
	let className = "NLT__header-menu-item NLT__selectable";
	if (selected) className += " NLT__selected";

	return (
		<li className={className} onClick={() => onClick()}>
			{icon !== null && <IconText iconText={content} icon={icon} />}
			{icon === null && <p className="NLT__p">{content}</p>}
		</li>
	);
}
