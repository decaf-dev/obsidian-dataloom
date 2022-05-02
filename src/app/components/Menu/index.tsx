import React, { useRef, useEffect } from "react";

import "./styles.css";

interface Props {
	isOpen: boolean;
	style?: object;
	children: React.ReactNode;
	onTabPress?: () => void;
	onOutsideClick: (e: MouseEvent | null) => void;
}

export default function Menu({
	isOpen,
	style,
	children,
	onTabPress,
	onOutsideClick,
}: Props) {
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target))
				onOutsideClick(e);
		};

		function handleKeyUp(e: KeyboardEvent) {
			if (e.key === "Enter") onOutsideClick(null);
			if (e.key === "Tab") onTabPress();
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClick);
			document.addEventListener("keyup", handleKeyUp);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [menuRef, onOutsideClick, isOpen]);

	if (!isOpen) {
		style = { ...style, display: "none" };
	}

	return (
		<div className="NLT__menu" ref={menuRef}>
			<div className="NLT__menu-container" style={style}>
				{children}
			</div>
		</div>
	);
}
