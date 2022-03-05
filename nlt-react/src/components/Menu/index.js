import React from "react";
import ClickableComponent from "../ClickableComponent";

export default function Menu({
	hide = false,
	style = {},
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
				<div className="menu NLT__menu--reset" style={style}>
					{content}
				</div>
			}
		></ClickableComponent>
	);
}
