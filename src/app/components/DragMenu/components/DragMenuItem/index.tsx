import React from "react";

import IconText from "../../../IconText";

interface Props {
	icon: string;
	iconText: string;
	onClick: () => void;
}
export default function DragMenuItem({ icon, iconText, onClick }: Props) {
	function handleKeyUp(e: React.KeyboardEvent<HTMLElement>) {
		if (e.key === "Enter") onClick();
	}
	return (
		<div
			tabIndex={0}
			onKeyUp={handleKeyUp}
			onClick={onClick}
			className="NLT__drag-menu-item"
		>
			<IconText icon={icon} iconText={iconText} />
		</div>
	);
}
