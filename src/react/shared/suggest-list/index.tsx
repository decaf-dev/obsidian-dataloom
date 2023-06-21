import React from "react";

import { css } from "@emotion/react";
import fuzzysort from "fuzzysort";

import SuggestItem from "./suggest-item";
import Input from "./input";
import Text from "src/react/shared/text";

import { nltEventSystem } from "src/shared/event-system/event-system";
import { useLogger } from "src/shared/logger";
import {
	VaultFile,
	getVaultFiles,
} from "src/obsidian-shim/development/vault-file";
import ClearButton from "./clear-button";
import CreateButton from "./create-button";
import Padding from "../padding";

interface ContentProps {
	showInput?: boolean;
	showCreate?: boolean;
	showClear?: boolean;
	filterValue?: string;
	hiddenExtensions?: string[];
	onItemClick: (item: VaultFile | null) => void;
	onCreateClick?: (value: string) => void;
	onClearClick?: () => void;
}

export function SuggestList({
	hiddenExtensions = [],
	showInput,
	showCreate,
	showClear,
	filterValue,
	onItemClick,
	onClearClick,
	onCreateClick,
}: ContentProps) {
	const [localFilterValue, setLocalFilterValue] = React.useState(
		filterValue ?? ""
	);
	const highlightItemRef = React.useRef<HTMLDivElement | null>(null);
	const [highlightIndex, setHighlightIndex] = React.useState(-1);

	const logger = useLogger();

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

	const files = getVaultFiles().filter(
		(file) => !hiddenExtensions.includes(file.extension)
	);

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

	const doesFilterFileExist = filteredFiles
		.map((file) => file.path)
		.includes(localFilterValue);

	return (
		<div
			className="NLT__suggest-menu"
			css={css`
				width: 100%;
			`}
		>
			{showInput && files.length > 0 && (
				<Input
					value={localFilterValue}
					onChange={setLocalFilterValue}
				/>
			)}
			{showCreate && !doesFilterFileExist && localFilterValue !== "" && (
				<CreateButton
					value={localFilterValue}
					onClick={onCreateClick}
				/>
			)}
			{files.length > 0 && (
				<div
					css={css`
						max-height: 175px;
						overflow-y: auto;
					`}
				>
					{filteredFiles.length === 0 && !showCreate && (
						<SuggestItem
							file={null}
							ref={null}
							isHighlighted
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
									onItemClick={onItemClick}
								/>
							))}
						</>
					)}
				</div>
			)}
			{files.length === 0 && (
				<Padding px="md" pb="md">
					<Text value="No image files found" />
				</Padding>
			)}
			{showClear && <ClearButton onClick={onClearClick} />}
		</div>
	);
}
