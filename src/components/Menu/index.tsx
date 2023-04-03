import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { closeTopLevelMenu } from "src/services/menu/menuSlice";
import { useAppDispatch } from "src/services/redux/hooks";
import { numToPx } from "src/services/string/conversion";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	top?: number;
	left?: number;
	maxWidth?: number;
	minWidth?: number;
	width?: number;
	height?: number;
	children: React.ReactNode;
}

export default function Menu({
	id,
	isOpen,
	top = 0,
	left = 0,
	minWidth = 0,
	maxWidth = 0,
	width = 0,
	height = 0,
	children,
}: Props) {
	const dispatch = useAppDispatch();

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code === "Escape" || e.code === "Enter") {
			dispatch(closeTopLevelMenu());
		}
	}

	function handleMouseDown(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest(`.NLT__menu`)) {
			dispatch(closeTopLevelMenu());
		}
	}

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("keyup", handleKeyUp);
			window.addEventListener("mousedown", handleMouseDown);
		} else {
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("mousedown", handleMouseDown);
		}
	}, [isOpen]);

	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div className="NLT__menu" id={id}>
						<div
							className="NLT__menu-container"
							style={{
								top: numToPx(top),
								left: numToPx(left),
								minWidth: numToPx(minWidth),
								maxWidth:
									maxWidth === 0
										? "max-content"
										: numToPx(maxWidth),
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
