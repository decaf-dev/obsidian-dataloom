import React from "react";

import { TFile } from "obsidian";

import SuggestMenu from "./suggest-menu";

import { usePlaceCursorAtEnd } from "src/shared/hooks";
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

import "./styles.css";
import {
	isInsertLineAltDown,
	isInsertLineDown,
} from "src/shared/keyboard-event";
import {
	LoomMenuCloseRequest,
	LoomMenuLevel,
} from "src/react/shared/menu-provider/types";
import {
	useMenu,
	useMenuOperations,
} from "src/react/shared/menu-provider/hooks";

interface Props {
	cellId: string;
	closeRequest: LoomMenuCloseRequest | null;
	value: string;
	shouldWrapOverflow: boolean;
	onChange: (value: string) => void;
	onClose: () => void;
}

export default function TextCellEdit({
	cellId,
	shouldWrapOverflow,
	closeRequest,
	value,
	onChange,
	onClose,
}: Props) {
	const COMPONENT_ID = `suggest-menu-${cellId}`;
	const menu = useMenu(COMPONENT_ID);

	const menuOperations = useMenuOperations();

	const [localValue, setLocalValue] = React.useState(value);
	const [cursorPosition, setCursorPosition] = React.useState<number | null>(
		null
	);
	const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
	const logger = useLogger();

	usePlaceCursorAtEnd(inputRef, localValue);

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

	React.useEffect(() => {
		if (closeRequest !== null) {
			logger("TextCellEdit onClose");
			if (localValue !== value) onChange(localValue);
			onClose();
		}
	}, [logger, value, localValue, closeRequest, onClose, onChange]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		const el = e.target as HTMLTextAreaElement;
		logger("TextCellEdit handleKeyDown");

		//Prevent enter from creating a new line
		//unless shift or alt is pressed
		if (e.key === "Enter") {
			if (!isInsertLineDown(e) && !isInsertLineAltDown(e)) {
				e.preventDefault();
			}
		}

		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const cursorPosition = el.selectionStart;

			if (menu.isOpen) {
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
		}

		// const cursorPosition = inputRef.current?.selectionStart ?? 0;
		// setLocalValue(
		// 	(prevState) =>
		// 		prevState.slice(0, cursorPosition) +
		// 		"\n" +
		// 		prevState.slice(cursorPosition)
		// );
		// setCursorPosition(cursorPosition + 1);
	}

	React.useEffect(() => {
		if (cursorPosition !== null && inputRef.current) {
			inputRef.current.selectionStart = cursorPosition;
			inputRef.current.selectionEnd = cursorPosition;
			setCursorPosition(null);
		}
	}, [cursorPosition, inputRef]);

	//Scroll to bottom when the value changes
	//This is necessary if we press `alt + shift` or `meta + shift` to insert a new line
	//This is what the browser does with `shift + enter` by default
	React.useEffect(
		function scrollToBottom() {
			if (inputRef.current) {
				inputRef.current.scrollTop = inputRef.current.scrollHeight;
			}
		},
		[inputRef, localValue]
	);

	function handleMenuOpen() {
		menu.onOpen(LoomMenuLevel.TWO);
	}

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		logger("TextCellEdit handleTextareaChange");

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
				handleMenuOpen();
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
		menuOperations.onCloseAll();
	}

	const overflowClassName = useOverflow(shouldWrapOverflow);
	const filterValue =
		getFilterValue(localValue, inputRef.current?.selectionStart ?? 0) ?? "";

	return (
		<>
			<div className="dataloom-text-cell-edit" ref={menu.triggerRef}>
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
				id={menu.id}
				isOpen={menu.isOpen}
				position={menu.position}
				filterValue={filterValue}
				onItemClick={handleSuggestItemClick}
			/>
		</>
	);
}
