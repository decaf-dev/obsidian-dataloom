import React, { useEffect, useRef } from "react";

export default function ClickableComponent({
	clickable = false,
	render = null,
	renderClickable = null,
	onOutsideClick = null,
	onClick = null,
}) {
	const ref = useRef(null);

	useEffect(() => {
		const handleClick = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				onOutsideClick();
			} else {
				onClick();
			}
		};

		function handleKeyUp(e) {
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
