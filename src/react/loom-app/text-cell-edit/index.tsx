import React from "react";

import { TFile } from "obsidian";

import SuggestMenu from "./suggest-menu";

import { useInputSelection } from "src/shared/hooks";
import { useOverflow } from "src/shared/spacing/hooks";
import {
	addClosingBracket,
	doubleBracketsInnerReplace,
	getFilterValue,
	isSurroundedByDoubleBrackets,
	removeClosingBracket,
} from "./utils";
import { getWikiLinkText } from "src/shared/link/link-utils";
import { useLogger } from "src/shared/logger";
import { LoomMenuCloseRequest, LoomMenuLevel } from "../../shared/menu/types";
import { useMenu, useMenuOperations } from "../../shared/menu/hooks";

import "./styles.css";

interface Props {
	closeRequest: LoomMenuCloseRequest | null;
	value: string;
	shouldWrapOverflow: boolean;
	onChange: (value: string) => void;
	onClose: () => void;
}

export default function TextCellEdit({
	shouldWrapOverflow,
	closeRequest,
	value,
	onChange,
	onClose,
}: Props) {
	const { onCloseAll } = useMenuOperations();
	const {
		menuId: suggestMenuId,
		triggerRef: suggestMenuTriggerRef,
		triggerPosition: suggestMenuTriggerPosition,
		isOpen: isSuggestMenuOpen,
		onOpen: onSuggestMenuOpen,
		onRequestClose: onSuggestMenuRequestClose,
		onClose: onSuggestMenuClose,
	} = useMenu({ level: LoomMenuLevel.TWO });

	const [localValue, setLocalValue] = React.useState(value);
	const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

	React.useEffect(() => {
		if (inputRef.current) {
			const selectionIndex = inputRef.current.selectionStart;
			//If we just added a closing bracket, move the selection index back 1
			if (
				localValue[selectionIndex - 1] === "]" &&
				localValue[selectionIndex - 2] === "["
			) {
				inputRef.current.selectionStart = selectionIndex - 1;
				inputRef.current.selectionEnd = selectionIndex - 1;
				//If we just added a the 2nd closing bracket, move the second index back 2
			} else if (
				localValue[selectionIndex - 1] === "]" &&
				localValue[selectionIndex - 2] === "]" &&
				localValue[selectionIndex - 3] === "["
			) {
				inputRef.current.selectionStart = selectionIndex - 2;
				inputRef.current.selectionEnd = selectionIndex - 2;
			}
		}
	}, [inputRef, localValue]);
	useInputSelection(inputRef, localValue);

	const logger = useLogger();

	React.useEffect(() => {
		if (closeRequest !== null) {
			if (localValue !== value) onChange(localValue);
			onClose();
		}
	}, [value, localValue, closeRequest, onClose, onChange]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		const el = e.target as HTMLTextAreaElement;
		logger("TextCellEdit handleKeyDown");

		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const cursorPosition = el.selectionStart;

			if (isSuggestMenuOpen) {
				//Close menu if cursor is outside of double brackets
				if (!isSurroundedByDoubleBrackets(value, cursorPosition))
					onClose();
			}

			if (inputRef.current) {
				//Update cursor position for filterValue calculation
				const inputEl = inputRef.current;
				inputEl.selectionStart = cursorPosition;
				inputEl.selectionEnd = cursorPosition;
			}
		} else if (e.key === "Enter") {
			//If we're pressing the shift key, don't propagate the event
			//this will stop the menu from closing. And allow the default event,
			//which is to insert a new line
			if (e.shiftKey && !isSuggestMenuOpen) {
				e.stopPropagation();
				return;
			}

			//Prevent defaults stop enter from inserting a new line
			e.preventDefault();
		}
	}

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const inputValue = e.target.value;
		let newValue = inputValue;

		if (inputRef.current) {
			const inputEl = inputRef.current;

			if (inputValue.length > localValue.length) {
				newValue = addClosingBracket(newValue, inputEl.selectionStart);
			} else {
				newValue = removeClosingBracket(
					localValue,
					inputValue,
					inputEl.selectionStart
				);
			}

			if (
				isSurroundedByDoubleBrackets(newValue, inputEl.selectionStart)
			) {
				onSuggestMenuOpen();
			}
		}

		setLocalValue(newValue);
	}

	function handleSuggestItemClick(file: TFile | null) {
		if (file) {
			const fileName = getWikiLinkText(file.path);

			const newValue = doubleBracketsInnerReplace(
				localValue,
				inputRef.current?.selectionStart ?? 0,
				fileName
			);

			onChange(newValue);
		}
		onCloseAll();
	}

	const overflowClassName = useOverflow(shouldWrapOverflow);
	const filterValue =
		getFilterValue(localValue, inputRef.current?.selectionStart ?? 0) ?? "";

	return (
		<>
			<div
				className="dataloom-text-cell-edit"
				ref={suggestMenuTriggerRef}
			>
				<textarea
					className={overflowClassName}
					autoFocus
					ref={inputRef}
					value={localValue}
					onKeyDown={handleKeyDown}
					onChange={handleTextareaChange}
					onBlur={(e) => {
						e.target.classList.add("dataloom-blur--cell");
					}}
				/>
			</div>
			<SuggestMenu
				id={suggestMenuId}
				isOpen={isSuggestMenuOpen}
				triggerPosition={suggestMenuTriggerPosition}
				filterValue={filterValue}
				onItemClick={handleSuggestItemClick}
				onRequestClose={onSuggestMenuRequestClose}
				onClose={onSuggestMenuClose}
			/>
		</>
	);
}
