import React from "react";

import Text from "src/react/shared/text";
import { TFile } from "obsidian";

import "./styles.css";

interface Props {
	index: number;
	file: TFile | null;
	isHighlighted: boolean;
	onItemClick: (item: TFile | null) => void;
}

const SuggestItem = React.forwardRef<HTMLDivElement, Props>(
	function SuggestItem(
		{ index, file, isHighlighted, onItemClick }: Props,
		ref
	) {
		const handleClick = React.useCallback(
			(e: React.MouseEvent) => {
				//Stop propagation so the menu doesn't remove the focus class
				e.stopPropagation();
				onItemClick(file);
			},
			[file, onItemClick]
		);

		function handleKeyDown(e: React.KeyboardEvent) {
			console.log("SuggestItem handleKeyDown", e.key);
			if (e.key === "Enter") {
				//Don't insert a new line
				e.preventDefault();
				onItemClick(file);
			}
		}

		let name = "No match found";
		if (file) {
			if (file.extension === "md") {
				//The basename does not include an extension
				name = file.basename;
			} else {
				//The name includes an extension
				name = file.name;
			}
		}

		let path: string | null = null;
		if (file) {
			if (file.parent && file.parent.path !== "/") {
				path = file.parent.path + "/";
			}
		}

		return (
			<div
				tabIndex={0}
				data-index={index}
				className="dataloom-suggest-item dataloom-focusable"
				ref={ref}
				style={{
					backgroundColor: isHighlighted
						? "var(--background-modifier-hover)"
						: "var(--background-primary)",
				}}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<Text
					variant="semibold"
					size="xs"
					value={name}
					maxWidth="275px"
				/>
				{path && <Text value={path} size="xs" />}
			</div>
		);
	}
);

export default SuggestItem;
