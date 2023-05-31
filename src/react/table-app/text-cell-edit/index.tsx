import React from "react";

import { TFile } from "obsidian";

import { useInputSelection } from "src/shared/hooks";
import { useOverflow } from "src/shared/spacing/hooks";

import { useMenu } from "src/shared/menu/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { MenuLevel } from "src/shared/menu/types";
import SuggestMenu from "./suggest-menu";
import {
	addClosingBracket,
	doubleBracketsInnerReplace,
	getFilterValue,
	isSurroundedByDoubleBrackets,
	removeClosingBracket,
} from "./utils";
import { isSpecialActionDown } from "src/shared/keyboard-event";

import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
	onChange: (value: string) => void;
}

export default function TextCellEdit({
	shouldWrapOverflow,
	value,
	onChange,
}: Props) {
	const { menu, isMenuOpen, menuRef, openMenu, closeAllMenus, closeTopMenu } =
		useMenu(MenuLevel.TWO);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		topOffset: 35,
	});

	const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
	const { setPreviousSelectionStart, previousSelectionStart } =
		useInputSelection(inputRef, value);
	const previousValue = React.useRef("");

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		const el = e.target as HTMLTextAreaElement;

		if (e.key === "Enter") {
			if (isSpecialActionDown(e)) return;
			e.preventDefault();
		} else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const cursorPosition = el.selectionStart;

			if (isMenuOpen) {
				//Close menu if cursor is outside of double brackets
				if (!isSurroundedByDoubleBrackets(value, cursorPosition))
					closeTopMenu();
			}

			//Update cursor position for filterValue calculation
			setPreviousSelectionStart(cursorPosition);
		}
	}

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const value = e.target.value;
		let newValue = value;

		if (inputRef.current) {
			const inputEl = inputRef.current;

			if (value.length > previousValue.current.length) {
				newValue = addClosingBracket(newValue, inputEl.selectionStart);
			} else {
				newValue = removeClosingBracket(
					previousValue.current,
					newValue,
					inputEl.selectionStart
				);
			}

			if (
				isSurroundedByDoubleBrackets(newValue, inputEl.selectionStart)
			) {
				if (!isMenuOpen) {
					openMenu(menu);
				}
			}

			if (inputEl.selectionStart)
				setPreviousSelectionStart(inputEl.selectionStart);
		}

		previousValue.current = newValue;
		onChange(newValue);
	}

	function handleSuggestItemClick(
		file: TFile | null,
		isFileNameUnique: boolean
	) {
		if (file) {
			//The basename does not include an extension
			let markdown = file.basename;
			//The name includes an extension
			if (file.extension !== "md") markdown = file.name;
			//If the file name is not unique, add the path so that the system can find it
			if (!isFileNameUnique) markdown = `${file.path}|${markdown}`;

			const newValue = doubleBracketsInnerReplace(
				value,
				previousSelectionStart,
				markdown
			);

			onChange(newValue);
		}
		closeAllMenus();
	}

	const overflowStyle = useOverflow(shouldWrapOverflow);
	const filterValue = getFilterValue(value, previousSelectionStart) ?? "";

	return (
		<>
			<div className="NLT__text-cell-edit" ref={triggerRef}>
				<textarea
					autoFocus
					css={overflowStyle}
					ref={inputRef}
					value={value}
					onKeyDown={handleKeyDown}
					onChange={handleTextareaChange}
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
