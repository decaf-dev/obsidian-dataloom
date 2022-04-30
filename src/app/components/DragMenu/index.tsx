import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import IconButton from "../IconButton";
import Menu from "../Menu";

import IconText from "../IconText";

import "./styles.css";
import { ICON } from "src/app/constants";

interface Props {
	rowId: string;
	isFirstRow: boolean;
	isLastRow: boolean;
	onMoveRowClick: (id: string, moveBelow: boolean) => void;
	onDeleteClick: (id: string) => void;
	onInsertRowClick: (id: string, insertBelow: boolean) => void;
}

export default function DragMenu({
	rowId,
	isFirstRow,
	isLastRow,
	onMoveRowClick,
	onDeleteClick,
	onInsertRowClick,
}: Props) {
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
		onClose();
	}

	function onClose() {
		setClickedButton(initialClickedButton);
	}

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

	function handleDeleteClick(id: string) {
		onDeleteClick(id);
		onClose();
	}

	function handleInsertRowClick(id: string, insertBelow: boolean) {
		onInsertRowClick(id, insertBelow);
		onClose();
	}

	function handleMoveRowClick(id: string, moveBelow: boolean) {
		onMoveRowClick(id, moveBelow);
		onClose();
	}

	return (
		<>
			<IconButton
				id={buttonId}
				icon={ICON.MORE_VERT}
				ref={buttonRef}
				onClick={handleDragClick}
			/>
			<Menu
				isOpen={clickedButton.isOpen}
				style={{
					top: `${clickedButton.top}px`,
					left: `${clickedButton.left}px`,
				}}
				onOutsideClick={handleOutsideClick}
			>
				<div className="NLT__drag-menu">
					{!isFirstRow && (
						<IconText
							icon={ICON.KEYBOARD_DOUBLE_ARROW_UP}
							iconText="Move Up"
							onClick={() => handleMoveRowClick(rowId, false)}
						/>
					)}
					{!isLastRow && (
						<IconText
							icon={ICON.KEYBOARD_DOUBLE_ARROW_DOWN}
							iconText="Move Down"
							onClick={() => handleMoveRowClick(rowId, true)}
						/>
					)}
					<IconText
						icon={ICON.KEYBOARD_ARROW_UP}
						iconText="Insert Above"
						onClick={() => handleInsertRowClick(rowId, false)}
					/>
					<IconText
						icon={ICON.KEYBOARD_ARROW_DOWN}
						iconText="Insert Below"
						onClick={() => handleInsertRowClick(rowId, true)}
					/>
					<IconText
						icon={ICON.DELETE}
						iconText="Delete"
						onClick={() => handleDeleteClick(rowId)}
					/>
				</div>
			</Menu>
		</>
	);
}
