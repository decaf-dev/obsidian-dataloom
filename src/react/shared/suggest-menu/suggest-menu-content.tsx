import React from "react";

import { TFile } from "obsidian";
import fuzzysort from "fuzzysort";

import SuggestItem from "./suggest-item";
import { filterUniqueStrings } from "./utils";
import { css } from "@emotion/react";
import { eventSystem } from "src/shared/event-system/event-system";
import { getTableBackgroundColor } from "src/shared/color";

interface ContentProps {
	showInput?: boolean;
	filterValue?: string;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

export default function SuggestMenuContent({
	showInput,
	filterValue,
	onItemClick,
}: ContentProps) {
	const [localFilterValue, setLocalFilterValue] = React.useState(
		filterValue ?? ""
	);
	const highlightItemRef = React.useRef<HTMLDivElement | null>(null);
	const [highlightIndex, setHighlightIndex] = React.useState(-1);

	const files = app.vault.getFiles();
	let filteredFiles: TFile[] = [];
	if (localFilterValue !== "") {
		//Do a fuzzy sort on the filtered items
		const results = fuzzysort.go(localFilterValue, files, {
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
		setLocalFilterValue(filterValue ?? "");
	}, [filterValue]);

	const isMountedRef = React.useRef(false);
	React.useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;
		} else {
			setHighlightIndex(0);
		}
	}, [localFilterValue]);

	React.useEffect(() => {
		if (highlightItemRef.current) {
			highlightItemRef.current.scrollIntoView({
				behavior: "auto",
				block: "nearest",
			});
		}
	}, [highlightIndex]);

	React.useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setHighlightIndex((prevIndex) => {
					const newIndex = Math.max(prevIndex - 1, 0);
					return newIndex;
				});
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setHighlightIndex((prevIndex) => {
					const newIndex = Math.min(
						prevIndex + 1,
						filteredFiles.length - 1
					);
					return newIndex;
				});
			}
		}

		eventSystem.addEventListener("keydown", handleKeyDown);
		return () => eventSystem.removeEventListener("keydown", handleKeyDown);
	}, [filteredFiles.length]);

	const fileNames = filteredFiles.map((file) => file.name);
	const uniqueFileNames = filterUniqueStrings(fileNames);

	const tableBackgroundColor = getTableBackgroundColor();

	return (
		<div className="NLT__suggest-menu">
			{showInput && (
				<div
					css={css`
						background-color: ${tableBackgroundColor};
						border-bottom: 1px solid var(--table-border-color);
						padding: 4px 10px;
					`}
				>
					<input
						css={css`
							background-color: transparent !important;
							border: 0 !important;
							box-shadow: none !important;
							width: 100%;
							padding-left: 5px !important;
							padding-right: 5px !important;
						`}
						autoFocus
						value={localFilterValue}
						onChange={(e) => setLocalFilterValue(e.target.value)}
					/>
				</div>
			)}
			<div
				css={css`
					max-height: 175px;
					overflow-y: auto;
				`}
			>
				{filteredFiles.length === 0 && (
					<SuggestItem
						file={null}
						ref={null}
						isHighlighted
						isFileNameUnique={false}
						onItemClick={onItemClick}
					/>
				)}
				{filteredFiles.length > 0 && (
					<>
						{filteredFiles.map((file, index) => (
							<SuggestItem
								key={file.path}
								ref={
									highlightIndex === index
										? highlightItemRef
										: null
								}
								file={file}
								isHighlighted={index === highlightIndex}
								isFileNameUnique={uniqueFileNames.includes(
									file.name
								)}
								onItemClick={onItemClick}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
