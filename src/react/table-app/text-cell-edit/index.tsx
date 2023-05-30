import React, { useRef } from "react";

import { useInputSelection } from "src/shared/hooks";
import { useOverflowClassName } from "src/shared/spacing/hooks";

import "./styles.css";
import { useMenu } from "src/shared/menu/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { MenuLevel } from "src/shared/menu/types";
import SuggestMenu from "./suggest-menu";
import { TFile } from "obsidian";
import {
	addClosingBracket,
	doubleBracketsInnerReplace,
	isSurroundedByDoubleBrackets,
	removeClosingBracket,
} from "./utils";
import { isSpecialActionDown } from "src/shared/keyboard-event";

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
	const { menu, isMenuOpen, menuRef, openMenu, closeAllMenus } = useMenu(
		MenuLevel.TWO
	);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		topOffset: 35,
	});

	const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
	const { setPreviousSelectionStart } = useInputSelection(inputRef, value);
	const previousValue = useRef("");

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
			if (isSpecialActionDown(e)) return;
			e.preventDefault();
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
				if (!isMenuOpen) openMenu(menu);
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
				inputRef.current?.selectionStart || 0,
				markdown
			);

			onChange(newValue);
		}
		closeAllMenus();
	}

	const className = useOverflowClassName(shouldWrapOverflow);
	const filterValue = value.substring(2, value.length - 2);
	return (
		<>
			<div className="NLT__text-cell-edit" ref={triggerRef}>
				<textarea
					autoFocus
					className={className}
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
