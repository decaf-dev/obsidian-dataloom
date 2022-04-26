import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import IconButton from "../IconButton";
import Menu from "../Menu";

import MoreVert from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

import IconText from "../IconText";

import "./styles.css";

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
		//TODO
		//Pick an order for close and handlers and stay consistant
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
						{!isFirstRow && (
							<IconText
								icon={
									<KeyboardDoubleArrowUpIcon className="NLT__icon--md NLT__margin-right" />
								}
								iconText="Move Up"
								onClick={() => handleMoveRowClick(rowId, false)}
							/>
						)}
						{!isLastRow && (
							<IconText
								icon={
									<KeyboardDoubleArrowDownIcon className="NLT__icon--md NLT__margin-right" />
								}
								iconText="Move Down"
								onClick={() => handleMoveRowClick(rowId, true)}
							/>
						)}
						<IconText
							icon={
								<KeyboardArrowUpIcon className="NLT__icon--md NLT__margin-right" />
							}
							iconText="Insert Above"
							onClick={() => handleInsertRowClick(rowId, false)}
						/>
						<IconText
							icon={
								<KeyboardArrowDownIcon className="NLT__icon--md NLT__margin-right" />
							}
							iconText="Insert Below"
							onClick={() => handleInsertRowClick(rowId, true)}
						/>
						<IconText
							icon={
								<DeleteIcon className="NLT__icon--md NLT__margin-right" />
							}
							iconText="Delete"
							onClick={() => handleDeleteClick(rowId)}
						/>
					</div>
				}
				onOutsideClick={handleOutsideClick}
			/>
		</>
	);
}
