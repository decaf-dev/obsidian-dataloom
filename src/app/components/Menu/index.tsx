import React from "react";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	top: number;
	left: number;
	children: React.ReactNode;
}

export default function Menu({ id, isOpen, top, left, children }: Props) {
	return (
		<>
			{isOpen && (
				<div className="NLT__menu" id={id}>
					<div
						className="NLT__menu-container"
						style={{
							top: `${top}px`,
							left: `${left}px`,
						}}
					>
						{children}
					</div>
				</div>
			)}
		</>
	);
}
