import React from "react";

import IconText from "../../../IconText";

import "./styles.css";

interface Props {
	icon: string;
	iconText: string;
	onClick: () => void;
}
export default function DragMenuItem({ icon, iconText, onClick }: Props) {
	return (
		<div onClick={() => onClick()} className="NLT__drag-menu-item">
			<IconText icon={icon} iconText={iconText} />
		</div>
	);
}
