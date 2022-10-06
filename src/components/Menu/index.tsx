import React from "react";
import { numToPx } from "src/services/string/conversion";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	top?: number;
	left?: number;
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
	width = 0,
	height = 0,
	children,
}: Props) {
	return (
		<>
			{isOpen && (
				<div className="NLT__menu" id={id}>
					<div
						className="NLT__menu-container"
						style={{
							top: numToPx(top),
							left: numToPx(left),
							minWidth: numToPx(minWidth),
							width: width === 0 ? "max-content" : numToPx(width),
							height:
								height === 0 ? "max-content" : numToPx(height),
						}}
					>
						{children}
					</div>
				</div>
			)}
		</>
	);
}
