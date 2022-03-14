import React from "react";
import ClickableComponent from "../ClickableComponent";

interface Props {
	hide: boolean;
	style: object;
	content: React.ReactNode;
	onOutsideClick: Function;
}
export default function Menu({ hide, style, content, onOutsideClick }: Props) {
	if (hide) return <></>;

	return (
		<ClickableComponent
			clickable={true}
			onClick={() => {}}
			onOutsideClick={onOutsideClick}
			render={() => {}}
			renderClickable={
				<div className="menu NLT__menu" style={style}>
					{content}
				</div>
			}
		></ClickableComponent>
	);
}
