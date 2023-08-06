import React from "react";

import ReactDOM from "react-dom";

import { numToPx } from "src/shared/conversion";
import { useMenuState } from "src/react/loom-app/menu-provider";
import { isTextSelected } from "src/shared/menu/utils";
import { removeFocusVisibleClass } from "src/shared/menu/focus-visible";
import { useLogger } from "src/shared/logger";
import { useMenuEvents } from "src/react/loom-app/app/hooks/use-menu-events";

import "./styles.css";

interface Props {
	id: string;
	isOpen: boolean;
	hideBorder?: boolean;
	top?: number;
	left?: number;
	width?: number;
	maxWidth?: number;
	maxHeight?: number;
	height?: number;
	children: React.ReactNode;
}

const Menu = React.forwardRef<HTMLDivElement, Props>(function Menu(
	{
		id,
		isOpen,
		hideBorder = false,
		top = 0,
		left = 0,
		width = 0,
		height = 0,
		maxHeight = 0,
		maxWidth = 0,
		children,
	}: Props,
	ref
) {
	const { topMenu, closeTopMenu, requestCloseTopMenu } = useMenuState();
	const isTextHighlighted = React.useRef(false);
	const logger = useLogger();

	useMenuEvents(id, isOpen, isTextHighlighted.current);

	function handleMouseDown() {
		isTextHighlighted.current = false;
	}

	function handleSelect() {
		isTextHighlighted.current = isTextSelected();
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("Menu handleKeyDown");

		if (e.key === "Enter") {
			requestCloseTopMenu("enter");
		} else if (e.key === "Escape") {
			closeTopMenu();
		}
	}

	function handleClick(e: React.MouseEvent) {
		logger("Menu handleClick");
		e.stopPropagation();

		//If we're clicking on the same menu, don't close it
		if (topMenu?.id === id) {
			if (topMenu.level === 0) removeFocusVisibleClass();
			return;
		}
		requestCloseTopMenu("click");
	}

	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div className="dataloom-menu" data-id={id}>
						<div
							ref={ref}
							className="dataloom-menu__container"
							style={{
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
								maxWidth:
									maxWidth !== 0
										? numToPx(maxWidth)
										: "unset",
								maxHeight:
									maxHeight !== 0
										? numToPx(maxHeight)
										: "unset",
								overflowY: maxHeight !== 0 ? "scroll" : "unset",
								boxShadow: hideBorder
									? "unset"
									: "0px 0px 0px 2px var(--background-modifier-border)",
							}}
							onClick={handleClick}
							onKeyDown={handleKeyDown}
							onMouseDown={handleMouseDown}
							onSelect={handleSelect}
						>
							{children}
						</div>
					</div>,
					document.body
				)}
		</>
	);
});

export default Menu;
