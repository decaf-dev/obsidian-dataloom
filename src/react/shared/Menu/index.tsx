import _ from "lodash";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
	closeAllMenus,
	closeTopLevelMenu,
	requestCloseTopLevelMenu,
} from "src/redux/menu/menu-slice";
import { useAppDispatch, useAppSelector } from "src/redux/global/hooks";
import { numToPx } from "src/shared/conversion";

import "./styles.css";
import { isTopLevelMenu } from "src/redux/menu/utils";

interface Props {
	id: string;
	isOpen: boolean;
	top?: number;
	left?: number;
	width?: string | number;
	height?: string | number;
	children: React.ReactNode;
}

export default function Menu({
	id,
	isOpen,
	top = 0,
	left = 0,
	width = "max-content",
	height = "max-content",
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
			//Wait for 200ms before add the event handlers
			//This is to prevent the menu closing when we open it using the enter key
			setTimeout(() => {
				window.addEventListener("keyup", handleKeyUp);
				window.addEventListener("mousedown", handleMouseDown);
			}, 200);
		}

		return () => {
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("mousedown", handleMouseDown);
		};
	}, [isOpen, isTopLevel]);

	let menuWidth = "";
	if (typeof width === "number") {
		menuWidth = numToPx(width);
	} else if (typeof width === "string") {
		menuWidth = width;
	}

	let menuHeight = "";
	if (typeof height === "number") {
		menuHeight = numToPx(height);
	} else if (typeof height === "string") {
		menuHeight = height;
	}

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
								width: menuWidth,
								height: menuHeight,
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
