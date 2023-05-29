import React from "react";

import ReactDOM from "react-dom";
import { css } from "@emotion/react";

import { numToPx } from "src/shared/conversion";
import { getTableBorderColor } from "src/shared/color";

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
	const tableBorderColor = getTableBorderColor();

	return (
		<>
			{isOpen &&
				ReactDOM.createPortal(
					<div
						className="NLT__menu"
						data-menu-id={id}
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
								border: 1px solid ${tableBorderColor};
								box-shadow: 0 2px 8px
									var(--background-modifier-box-shadow);
								border-radius: 4px;
								font-weight: 400;
							`}
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
