import React from "react";

import IconText from "../../../IconText";

interface Props {
	icon?: string;
	iconText: string;
	onClick: any;
	selected?: boolean;
}
export default function HeaderMenuItem({
	icon = "",
	iconText,
	onClick,
	selected = false,
}: Props) {
	let className = "NLT__header-menu-item NLT__selectable";
	if (selected) className += " NLT__selected";

	return (
		<li className={className} onClick={() => onClick()}>
			<IconText iconText={iconText} icon={icon} />
		</li>
	);
}
