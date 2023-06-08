import React from "react";

import ReactDOM from "react-dom";
import { css } from "@emotion/react";

import { numToPx } from "src/shared/conversion";
import { useMenuContext } from "src/shared/menu/menu-context";
import { EVENT_OUTSIDE_CLICK } from "src/shared/events";
import { isTextSelected } from "src/shared/menu/utils";

interface Props {
	id: string;
	isOpen: boolean;
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
	const { topMenu, closeTopMenu, requestCloseTopMenu } = useMenuContext();
	const isTextHighlighted = React.useRef(false);

	function handleMouseDown() {
		isTextHighlighted.current = false;
	}

	function handleSelect() {
		isTextHighlighted.current = isTextSelected();
	}

	//Handle outside clicks
	//The events are triggered from the Obsidian event registered in main.ts
	React.useEffect(() => {
		function handleOutsideClick() {
			if (topMenu?.id !== id) return;

			//If we just highlighted text in an input and we released the mouse outside of the
			//menu, don't close the menu
			if (isTextHighlighted.current) {
				isTextHighlighted.current = false;
				return;
			}
			closeTopMenu();
		}

		if (isOpen) {
			//@ts-expect-error not a native Obsidian event
			app.workspace.on(EVENT_OUTSIDE_CLICK, handleOutsideClick);
		}

		return () => app.workspace.off(EVENT_OUTSIDE_CLICK, handleOutsideClick);
	}, [isOpen]);

	function handleKeyDown(e: React.KeyboardEvent) {
		console.log("MENU KEY DOWN");

		if (e.key === "Enter") {
			//Stop click event from running
			e.preventDefault();
			requestCloseTopMenu("enter");
		}
	}

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();

		//If we're clicking on the same menu, don't close it
		if (topMenu?.id === id) return;
		closeTopMenu();
	}

	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div
						className="NLT__menu"
						data-id={id}
						css={css`
							width: 0;
							height: 0;
						`}
					>
						<div
							ref={ref}
							css={css`
								position: absolute;
								z-index: var(--layer-menu);
								top: ${numToPx(top)};
								left: ${numToPx(left)};
								width: ${width !== 0
									? numToPx(width)
									: "max-content"};
								height: ${height !== 0
									? numToPx(height)
									: "max-content"};
								max-width: ${maxWidth !== 0
									? numToPx(maxWidth)
									: "unset"};
								max-height: ${maxHeight !== 0
									? numToPx(maxHeight)
									: "unset"};
								overflow-y: ${maxHeight !== 0
									? "scroll"
									: "unset"};
								background-color: var(--background-primary);
								border: 1px solid var(--modal-border-color);
								font-weight: 400;
							`}
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
