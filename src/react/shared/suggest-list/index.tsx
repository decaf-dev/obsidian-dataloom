import React from "react";

import fuzzysort from "fuzzysort";

import SuggestItem from "./suggest-item";
import SuggestInput from "./suggest-input";
import Text from "src/react/shared/text";
import ClearButton from "./clear-button";
import CreateButton from "./create-button";
import Divider from "../divider";
import Padding from "../padding";

import { nltEventSystem } from "src/shared/event-system/event-system";
import { useLogger } from "src/shared/logger";
import { TFile } from "obsidian";

import "./styles.css";
import { useAppMount } from "src/react/loom-app/app-mount-provider";

interface ContentProps {
	showInput?: boolean;
	showCreate?: boolean;
	showClear?: boolean;
	filterValue?: string;
	hiddenExtensions?: string[];
	onItemClick: (item: TFile | null) => void;
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

	const { app } = useAppMount();
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

	const files = app.vault
		.getFiles()
		.filter((file) => !hiddenExtensions.includes(file.extension));

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
		function handleKeyDown() {
			logger("SuggestMenuContent handleKeyDown");

			const focusedEl = document.activeElement;
			if (!focusedEl) return;

			if (focusedEl.classList.contains("dataloom-suggest-item")) {
				const index = focusedEl.getAttribute("data-index");
				if (!index) return;

				setHighlightIndex(parseInt(index));
				return;
			}

			setHighlightIndex(-1);
		}

		nltEventSystem.addEventListener("keydown", handleKeyDown);
		return () =>
			nltEventSystem.removeEventListener("keydown", handleKeyDown);
	}, [filteredFiles.length, logger, highlightIndex]);

	const doesFilterFileExist = filteredFiles
		.map((file) => file.path)
		.includes(localFilterValue);

	return (
		<div className="dataloom-suggest-menu">
			{showInput && files.length > 0 && (
				<>
					<SuggestInput
						value={localFilterValue}
						onChange={setLocalFilterValue}
					/>
					<Divider />
				</>
			)}
			{showCreate && !doesFilterFileExist && localFilterValue !== "" && (
				<CreateButton
					value={localFilterValue}
					onClick={onCreateClick}
				/>
			)}
			{files.length > 0 && (
				<div className="dataloom-suggest-menu__container">
					{filteredFiles.length === 0 && !showCreate && (
						<SuggestItem
							index={0}
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
									index={index}
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
