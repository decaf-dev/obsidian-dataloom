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

	function handleKeyUp(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			onClick();
		}
	}

	return (
		<li
			tabIndex={0}
			className={className}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			onKeyUp={handleKeyUp}
		>
			<IconText iconText={iconText} icon={icon} />
		</li>
	);
}
