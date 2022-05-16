import React from "react";

import IconText from "../../../IconText";

import "./styles.css";

interface Props {
	icon: string;
	iconText: string;
	onClick: () => void;
}
export default function DragMenuItem({ icon, iconText, onClick }: Props) {
	//Add onMouseDown to prevent blur event being called in the FocusProvider
	//See: https://github.com/react-toolbox/react-toolbox/issues/1323#issuecomment-656778859
	return (
		<div onClick={() => onClick()} className="NLT__drag-menu-item">
			<IconText icon={icon} iconText={iconText} />
		</div>
	);
}
