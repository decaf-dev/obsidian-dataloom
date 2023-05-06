import React from "react";
import ReactDOM from "react-dom";
import { numToPx } from "src/shared/conversion";

import "./styles.css";

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
									width !== 0
										? numToPx(width)
										: "max-content",
								height:
									height !== 0
										? numToPx(height)
										: "max-content",
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
