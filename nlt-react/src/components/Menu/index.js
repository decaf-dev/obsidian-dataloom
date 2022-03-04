import React from "react";
import ClickableComponent from "../ClickableComponent";

export default function Menu({
	hide = false,
	left = 0,
	top = 0,
	height = "initial",
	content = "",
	onOutsideClick = null,
}) {
	if (hide) return <></>;

	return (
		<ClickableComponent
			clickable={true}
			onClick={() => {}}
			onOutsideClick={onOutsideClick}
			renderClickable={
				<div className="menu NLT__menu" style={{ left, top, height }}>
					{content}
				</div>
			}
		></ClickableComponent>
	);
}
