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
	height?: number;
	children: React.ReactNode;
	isReady: boolean;
}

export default function Menu({
	id,
	isOpen,
	top = 0,
	left = 0,
	width = 0,
	height = 0,
	maxWidth = 0,
	children,
	isReady,
}: Props) {
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
							css={css`
								background-color: var(--background-primary);
								border: 1px solid ${tableBorderColor};
								box-shadow: 0 2px 8px
									var(--background-modifier-box-shadow);
								z-index: var(--layer-menu);
								position: absolute;
								border-radius: 4px;
								font-weight: 400;
								visibility: ${isReady ? "visible" : "hidden"};
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
							`}
						>
							{children}
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
