import React from "react";
import ReactDOM from "react-dom";
import { numToPx } from "src/services/string/parsers";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	style: {
		top: string;
		left: string;
		width?: string;
		height?: string;
		maxWidth?: string;
		minWidth?: string;
		minHeight?: string;
	};
	children: React.ReactNode;
}

export default function Menu({ id, isOpen, style, children }: Props) {
	//Add onMouseDown to prevent blur event being called in the FocusProvider
	//See: https://github.com/react-toolbox/react-toolbox/issues/1323#issuecomment-656778859
	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div
						className="NLT__menu"
						id={id}
						onMouseDown={(e) => e.preventDefault()}
					>
						<div className="NLT__menu-container" style={style}>
							{children}
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
