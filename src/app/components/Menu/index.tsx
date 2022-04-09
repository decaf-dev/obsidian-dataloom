import React from "react";
import ClickableComponent from "../ClickableComponent";

interface Props {
	isOpen: boolean;
	style?: object;
	content: React.ReactNode;
	onOutsideClick: (e: MouseEvent | undefined) => void;
}

export default function Menu({
	isOpen,
	style,
	content,
	onOutsideClick,
}: Props) {
	if (!isOpen) return <></>;

	return (
		<ClickableComponent
			clickable={true}
			onClick={() => {}}
			onOutsideClick={onOutsideClick}
			render={() => {}}
			renderClickable={
				<div className="NLT__menu" style={style}>
					{content}
				</div>
			}
		></ClickableComponent>
	);
}
