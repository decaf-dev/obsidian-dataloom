import React, { useState, useEffect, useRef } from "react";

import Icon from "../Icon";
import Menu from "../Menu";

import DragIndicator from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForceUpdate } from "../../services/utils";

export default function DragMenu({ onDeleteClick = null }) {
	const initialClickedButton = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};
	const [clickedButton, setClickedButton] = useState(initialClickedButton);

	const buttonRef = useRef();
	const forceUpdate = useForceUpdate();

	function handleOutsideClick() {
		setClickedButton(initialClickedButton);
	}

	function handleDragClick() {
		if (clickedButton.height > 0) return;

		const { x, y, width, height } =
			buttonRef.current.getBoundingClientRect();
		setClickedButton({ top: y, left: x, width, height });
		forceUpdate();
	}

	useEffect(() => {
		if (clickedButton.height > 0) forceUpdate();
	}, [clickedButton.height]);

	return (
		<td className="NLT__hidden-column">
			<Icon
				icon={<DragIndicator />}
				ref={buttonRef}
				onClick={handleDragClick}
			/>
			<Menu
				hide={clickedButton.height === 0}
				style={{
					top: clickedButton.top,
					left: clickedButton.left + clickedButton.width,
				}}
				content={
					<div className="NLT__drag-menu-inner">
						<div
							className="NLT__icon-item NLT__selectable"
							onClick={onDeleteClick}
						>
							<DeleteIcon
								style={{ width: "1rem", marginRight: "5px" }}
							/>
							Delete
						</div>
					</div>
				}
				onOutsideClick={handleOutsideClick}
			/>
		</td>
	);
}
