import React from "react";

import IconText from "../../../IconText";

interface Props {
	icon: string;
	iconText: string;
	onClick: () => void;
}
export default function DragMenuItem({ icon, iconText, onClick }: Props) {
	return (
		<div tabIndex={0} className="NLT__drag-menu-item">
			<IconText icon={icon} iconText={iconText} onClick={onClick} />
		</div>
	);
}
