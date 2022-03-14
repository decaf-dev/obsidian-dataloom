import React from "react";

import "./styles.css";

interface Props {
	iconText: string;
	icon: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
export default function IconText({ iconText, icon, onClick }: Props) {
	return (
		<div className="NLT__icon-text NLT__selectable" onClick={onClick}>
			{icon}
			{iconText}
		</div>
	);
}
