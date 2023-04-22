import _ from "lodash";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
	closeAllMenus,
	closeTopLevelMenu,
	requestCloseTopLevelMenu,
} from "src/services/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { numToPx } from "src/services/string/conversion";

import "./styles.css";
import { isTopLevelMenu } from "src/services/menu/utils";

interface Props {
	id: string;
	isOpen: boolean;
	top?: number;
	left?: number;
	width?: number;
	height?: number;
	children: React.ReactNode;
}

export default function Menu({
	id,
	isOpen,
	top = 0,
	left = 0,
	width = 0,
	height = 0,
	children,
}: Props) {
	const isTopLevel = useAppSelector((state) => isTopLevelMenu(state, id));
	const dispatch = useAppDispatch();

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code === "Escape" || e.code === "Enter") {
			// If the user is holding down the shift key, they are probably
			// trying to insert a new line into the text cell. In this case, we don't
			// want to close the menu.
			if (!e.shiftKey)
				dispatch(requestCloseTopLevelMenu(e.code === "Enter"));
		}
	}

	function handleMouseDown(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (isTopLevel) {
			if (!target.closest(".NLT__menu")) dispatch(closeAllMenus());
			if (!target.closest(`#${id}`)) dispatch(closeTopLevelMenu());
		}
	}

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("keyup", handleKeyUp);
			window.addEventListener("mousedown", handleMouseDown);
		}

		return () => {
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("mousedown", handleMouseDown);
		};
	}, [isOpen, isTopLevel]);

	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div className="NLT__menu" id={id}>
						<div
							className="NLT__menu-container"
							style={{
								visibility: "hidden",
								top: numToPx(top),
								left: numToPx(left),
								width:
									width === 0
										? "max-content"
										: numToPx(width),
								height:
									height === 0
										? "max-content"
										: numToPx(height),
							}}
						>
							{children}
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
