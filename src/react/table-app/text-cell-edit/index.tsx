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
	isSurroundedByDoubleBrackets,
	removeClosingBracket,
	replaceDoubleBracketText,
} from "./utils";

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
	const { menu, isMenuOpen, menuRef, openMenu, closeTopMenu } = useMenu(
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
			if (isMenuOpen) {
				e.preventDefault();
			}
		}
	}

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const value = e.target.value;
		let newValue = value;

		if (inputRef.current) {
			const inputEl = inputRef.current;

			if (value.length > previousValue.current.length) {
				newValue = addClosingBracket(inputEl, newValue);
			} else {
				newValue = removeClosingBracket(
					inputEl,
					previousValue.current,
					newValue
				);
			}

			if (
				isSurroundedByDoubleBrackets(
					newValue,
					inputEl.selectionStart - 1
				)
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
			let markdown = file.name;
			if (!isFileNameUnique) markdown = `${file.path}|${file.name}`;

			//Replace if necessary
			const newValue = replaceDoubleBracketText(
				value,
				inputRef.current?.selectionStart || 0,
				markdown
			);

			onChange(newValue);
		}
		closeTopMenu();
		closeTopMenu();
	}

	const className = useOverflowClassName(shouldWrapOverflow);
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
				filterValue={value.substring(2, value.length - 2)}
				onItemClick={handleSuggestItemClick}
			/>
		</>
	);
}
