import React from "react";

import fuzzysort from "fuzzysort";

import SuggestItem from "./suggest-item";
import { filterUniqueStrings } from "./utils";
import { css } from "@emotion/react";
import { nltEventSystem } from "src/shared/event-system/event-system";
import { transparentInputStyle } from "src/react/table-app/shared-styles";
import { useLogger } from "src/shared/logger";
import {
	VaultFile,
	getVaultFiles,
} from "src/obsidian-shim/development/vault-file";

interface ContentProps {
	showInput?: boolean;
	filterValue?: string;
	onItemClick: (item: VaultFile | null, isFileNameUnique: boolean) => void;
}

export default function SuggestMenuContent({
	showInput,
	filterValue,
	onItemClick,
}: ContentProps) {
	const logger = useLogger();
	const [localFilterValue, setLocalFilterValue] = React.useState(
		filterValue ?? ""
	);
	const highlightItemRef = React.useRef<HTMLDivElement | null>(null);
	const [highlightIndex, setHighlightIndex] = React.useState(-1);

	const files = getVaultFiles();
	let filteredFiles: VaultFile[] = [];
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
		filteredFiles.sort((a, b) => b.modifiedTime - a.modifiedTime);
		filteredFiles = filteredFiles.slice(0, 20);
	}

	React.useEffect(() => {
		setLocalFilterValue(filterValue ?? "");
	}, [filterValue]);

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
			logger("SuggestMenuContent handleKeyDown");
			if (e.key === "ArrowUp") {
				//Prevent default scrolling
				e.preventDefault();
				setHighlightIndex((prevIndex) => {
					let index = prevIndex - 1;
					if (index < 0) index = filteredFiles.length - 1;
					return index;
				});
			} else if (e.key === "ArrowDown") {
				//Prevent default scrolling
				e.preventDefault();

				setHighlightIndex((prevIndex) => {
					let index = prevIndex + 1;
					if (index > filteredFiles.length - 1) index = 0;
					return index;
				});
			} else if (e.key === "Tab") {
				setHighlightIndex((prevIndex) => {
					let index = prevIndex + 1;
					if (index > filteredFiles.length - 1) index = 0;
					return index;
				});
			}
		}

		nltEventSystem.addEventListener("keydown", handleKeyDown);
		return () =>
			nltEventSystem.removeEventListener("keydown", handleKeyDown);
	}, [filteredFiles.length, logger, highlightIndex]);

	const fileNames = filteredFiles.map((file) => file.name);
	const uniqueFileNames = filterUniqueStrings(fileNames);

	return (
		<div className="NLT__suggest-menu">
			{showInput && (
				<div
					css={css`
						background-color: var(--background-secondary);
						border-bottom: 1px solid var(--table-border-color);
						padding: 4px 10px;
					`}
				>
					<input
						css={transparentInputStyle}
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
