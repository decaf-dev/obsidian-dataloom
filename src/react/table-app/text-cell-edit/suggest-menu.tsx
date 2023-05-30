import React from "react";

import { TFile } from "obsidian";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import fuzzysort from "fuzzysort";

import Menu from "src/react/shared/menu";
import SuggestItem from "./suggest-item";
import { findUniqueStrings } from "./utils";
import { css } from "@emotion/react";
import { eventSystem } from "src/shared/event-system/event-system";

interface ContentProps {
	filterValue: string;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

const SuggestMenuContent = ({ filterValue, onItemClick }: ContentProps) => {
	const [highlightedIndex, setHighlightedIndex] = React.useState(0);
	const virtuosoRef = React.useRef<VirtuosoHandle>(null);

	const files = app.vault.getFiles();
	let filteredFiles: TFile[] = [];
	if (filterValue !== "") {
		//Do a fuzzy sort on the filtered items
		const results = fuzzysort.go(filterValue, files, {
			key: "path",
			limit: 20,
		});
		filteredFiles = results.map((result) => result.obj);
	} else {
		//Otherwise we just sort by last modified
		filteredFiles = files;
		filteredFiles.sort((a, b) => b.stat.mtime - a.stat.mtime);
		filteredFiles = filteredFiles.slice(0, 20);
	}

	React.useEffect(() => {
		setHighlightedIndex(0);
	}, [filterValue]);

	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setHighlightedIndex((prevIndex) => {
					const newIndex = Math.max(prevIndex - 1, 0);
					virtuosoRef.current?.scrollIntoView({
						index: newIndex,
						behavior: "auto",
					});
					return newIndex;
				});
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setHighlightedIndex((prevIndex) => {
					const newIndex = Math.min(
						prevIndex + 1,
						filteredFiles.length - 1
					);
					virtuosoRef.current?.scrollIntoView({
						index: newIndex,
						behavior: "auto",
					});
					return newIndex;
				});
			}
		}

		eventSystem.addEventListener("keydown", handleKeyDown);
		return () => eventSystem.removeEventListener("keydown", handleKeyDown);
	}, [filteredFiles.length, virtuosoRef.current]);

	const fileNames = filteredFiles.map((file) => file.name);
	const uniqueFileNames = findUniqueStrings(fileNames);

	console.log(fileNames);

	return (
		<div className="NLT__suggest-menu">
			{filteredFiles.length === 0 && (
				<div
					css={css`
						width: 375px;
						height: 50px;
					`}
				>
					<SuggestItem
						file={null}
						isHighlighted
						isFileNameUnique={false}
						onItemClick={onItemClick}
					/>
				</div>
			)}
			{filteredFiles.length !== 0 && (
				<Virtuoso
					ref={virtuosoRef}
					style={{ height: "300px", width: "375px" }}
					totalCount={filteredFiles.length}
					itemContent={(index) => {
						const file = filteredFiles[index];
						return (
							<SuggestItem
								file={file}
								isHighlighted={index === highlightedIndex}
								isFileNameUnique={uniqueFileNames.includes(
									file.name
								)}
								onItemClick={onItemClick}
							/>
						);
					}}
				/>
			)}
		</div>
	);
};

interface Props {
	id: string;
	isOpen: boolean;
	top: number;
	left: number;
	filterValue: string;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

const SuggestMenu = React.forwardRef<HTMLDivElement, Props>(
	function SuggestMenu(
		{ id, isOpen, top, left, filterValue, onItemClick }: Props,
		ref
	) {
		return (
			<Menu id={id} isOpen={isOpen} top={top} left={left} ref={ref}>
				<SuggestMenuContent
					filterValue={filterValue}
					onItemClick={onItemClick}
				/>
			</Menu>
		);
	}
);

export default SuggestMenu;
