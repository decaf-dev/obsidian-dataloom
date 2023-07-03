import React from "react";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { useOverflow } from "src/shared/spacing/hooks";

import { useMenu } from "src/shared/menu/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { MenuCloseRequest, MenuLevel } from "src/shared/menu/types";
import SuggestMenu from "./suggest-menu";
import {
	addClosingBracket,
	doubleBracketsInnerReplace,
	getFilterValue,
	isSurroundedByDoubleBrackets,
	removeClosingBracket,
} from "./utils";

import { getWikiLinkText } from "src/shared/link/link-utils";
import { css } from "@emotion/react";
import { textAreaStyle } from "src/react/dashboard-app/shared-styles";
import { useLogger } from "src/shared/logger";
import { TFile } from "obsidian";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	value: string;
	shouldWrapOverflow: boolean;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function TextCellEdit({
	shouldWrapOverflow,
	menuCloseRequest,
	value,
	onChange,
	onMenuClose,
}: Props) {
	const { menu, isMenuOpen, menuRef, openMenu, closeAllMenus, closeTopMenu } =
		useMenu(MenuLevel.TWO);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		topOffset: 35,
	});

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

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			if (localValue !== value) onChange(localValue);
			onMenuClose();
		}
	}, [
		value,
		localValue,
		hasCloseRequestTimeChanged,
		menuCloseRequest,
		onMenuClose,
		onChange,
	]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		const el = e.target as HTMLTextAreaElement;
		logger("TextCellEdit handleKeyDown");

		if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const cursorPosition = el.selectionStart;

			if (isMenuOpen) {
				//Close menu if cursor is outside of double brackets
				if (!isSurroundedByDoubleBrackets(value, cursorPosition))
					closeTopMenu();
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
			if (e.shiftKey && !isMenuOpen) {
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
				if (!isMenuOpen) openMenu(menu);
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
		closeAllMenus();
	}

	const overflowStyle = useOverflow(shouldWrapOverflow);
	const filterValue =
		getFilterValue(localValue, inputRef.current?.selectionStart ?? 0) ?? "";

	return (
		<>
			<div
				className="Dashboards__text-cell-edit"
				ref={triggerRef}
				css={css`
					width: 100%;
					height: 100%;
				`}
			>
				<textarea
					autoFocus
					css={css`
						${textAreaStyle}
						${overflowStyle}
					`}
					ref={inputRef}
					value={localValue}
					onKeyDown={handleKeyDown}
					onChange={handleTextareaChange}
					onBlur={(e) => {
						e.target.classList.add("Dashboards__blur--cell");
					}}
				/>
			</div>
			<SuggestMenu
				id={menu.id}
				ref={menuRef}
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				filterValue={filterValue}
				onItemClick={handleSuggestItemClick}
			/>
		</>
	);
}
