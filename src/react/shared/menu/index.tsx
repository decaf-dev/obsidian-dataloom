import React from "react";

import ReactDOM from "react-dom";
import { css } from "@emotion/react";

import { numToPx } from "src/shared/conversion";
import { useMenuContext } from "src/shared/menu/menu-context";

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
	const { topMenu, closeTopMenu } = useMenuContext();

	function handleKeyDown(e: React.KeyboardEvent) {
		//Don't propagate click events to menus further up the tree
		e.stopPropagation();

		//Stop click event from running
		e.preventDefault();

		if (e.key === "Enter") {
			closeTopMenu();
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
