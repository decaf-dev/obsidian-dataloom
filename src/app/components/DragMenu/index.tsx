import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import IconButton from "../IconButton";
import Menu from "../Menu";

import MoreVert from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

import IconText from "../IconText";

import "./styles.css";

interface Props {
	onDeleteClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function DragMenu({ onDeleteClick }: Props) {
	const initialClickedButton = {
		top: 0,
		left: 0,
		isOpen: false,
	};
	const [clickedButton, setClickedButton] = useState(initialClickedButton);
	const [buttonId] = useState(uuidv4());

	const buttonRef = useRef<HTMLInputElement>();

	function handleOutsideClick(e: MouseEvent | undefined) {
		if (e) {
			const el = e.target as HTMLInputElement;
			if (el.id === buttonId) return;
		}
		setClickedButton(initialClickedButton);
	}

	// function getOffset(el: HTMLElement) {
	// 	const rect = el.getBoundingClientRect();
	// 	return {
	// 		left: rect.left + window.scrollX,
	// 		top: rect.top + window.scrollY,
	// 	};
	// }

	function handleDragClick() {
		if (clickedButton.isOpen) {
			setClickedButton(initialClickedButton);
			return;
		}

		if (buttonRef.current) {
			const { width, height } = buttonRef.current.getBoundingClientRect();

			setClickedButton({
				left: -width - 62,
				top: -height,
				isOpen: true,
			});
		}
	}

	return (
		<div className="NLT__td NLT__hidden-column">
			<IconButton
				id={buttonId}
				icon={<MoreVert />}
				ref={buttonRef}
				onClick={handleDragClick}
			/>
			<Menu
				isOpen={clickedButton.isOpen}
				style={{
					top: `${clickedButton.top}px`,
					left: `${clickedButton.left}px`,
				}}
				content={
					<div className="NLT__drag-menu-container">
						<IconText
							icon={
								<DeleteIcon className="NLT__icon--md NLT__margin-right" />
							}
							iconText="Delete"
							onClick={onDeleteClick}
						/>
					</div>
				}
				onOutsideClick={handleOutsideClick}
			/>
		</div>
	);
}
