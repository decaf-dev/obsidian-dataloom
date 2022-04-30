import React, { useRef, useEffect } from "react";

interface Props {
	isOpen: boolean;
	style?: object;
	content: React.ReactNode;
	onOutsideClick: (e: MouseEvent | null) => void;
}

export default function Menu({
	isOpen,
	style,
	content,
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
		}

		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keyup", handleKeyUp);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [menuRef, onOutsideClick]);

	if (!isOpen) return <></>;

	return (
		<div className="NLT__menu" ref={menuRef}>
			<div className="NLT__menu-container" style={style}>
				{content}
			</div>
		</div>
	);
}
