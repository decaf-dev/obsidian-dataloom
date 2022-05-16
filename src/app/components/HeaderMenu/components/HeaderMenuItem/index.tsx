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

	//Add onMouseDown to prevent blur event being called in the FocusProvider
	//See: https://github.com/react-toolbox/react-toolbox/issues/1323#issuecomment-656778859
	return (
		<li
			className={className}
			onMouseDown={(e) => e.preventDefault()}
			onClick={() => onClick()}
		>
			<IconText iconText={iconText} icon={icon} />
		</li>
	);
}
