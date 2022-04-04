import React, { useEffect, useRef } from "react";

interface Props {
	clickable: boolean;
	render: React.ReactNode;
	renderClickable: React.ReactNode;
	onOutsideClick: () => void;
	onClick?: () => void;
}

export default function ClickableComponent({
	clickable = false,
	render,
	renderClickable,
	onOutsideClick,
	onClick,
}: Props) {
	const ref = useRef(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target)) {
				onOutsideClick();
				return;
			}
			onClick && onClick();
		};

		function handleKeyUp(e: KeyboardEvent) {
			if (!clickable) return;

			if (e.key === "Enter") onOutsideClick();
		}

		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keyup", handleKeyUp);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [ref, clickable, onOutsideClick]);

	return <div ref={ref}>{clickable ? renderClickable : render}</div>;
}
