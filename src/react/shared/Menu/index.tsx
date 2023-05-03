import React from "react";
import ReactDOM from "react-dom";
import { numToPx } from "src/shared/conversion";

import "./styles.css";

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
	console.log(isOpen);
	console.log(id);
	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div className="NLT__menu" data-menu-id={id}>
						<div
							className="NLT__menu-container"
							style={{
								visibility: "hidden",
								top: numToPx(top),
								left: numToPx(left),
								width:
									typeof width === "number"
										? numToPx(width)
										: width,
								height:
									typeof height === "number"
										? numToPx(height)
										: height,
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
