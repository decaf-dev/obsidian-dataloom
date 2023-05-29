import React from "react";

import { TFile } from "obsidian";
import { Virtuoso } from "react-virtuoso";
import fuzzysort from "fuzzysort";

import Menu from "src/react/shared/menu";
import SuggestItem from "./suggest-item";
import { findUniqueStrings } from "./utils";

interface Props {
	id: string;
	isOpen: boolean;
	top: number;
	left: number;
	filterValue: string;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

interface ContentProps {
	filterValue: string;
	onItemClick: (item: TFile | null, isFileNameUnique: boolean) => void;
}

const SuggestMenuContent = ({ filterValue, onItemClick }: ContentProps) => {
	const files = app.vault.getFiles();

	let filteredFiles: TFile[] = [];
	if (filterValue !== "") {
		const results = fuzzysort.go(filterValue, files, {
			key: "path",
			limit: 20,
		});
		filteredFiles = results.map((result) => result.obj);
	} else {
		filteredFiles = files;
		filteredFiles.sort((a, b) => b.stat.mtime - a.stat.mtime);
		filteredFiles = filteredFiles.slice(0, 20);
	}

	const fileNames = filteredFiles.map((file) => file.name);
	const uniqueFileNames = findUniqueStrings(fileNames);

	return (
		<div className="NLT__suggest-menu">
			<Virtuoso
				style={{ height: "300px", width: "375px" }}
				totalCount={filteredFiles.length}
				itemContent={(index) => {
					const file = filteredFiles[index];
					console.log(uniqueFileNames.includes(file.name));
					return (
						<SuggestItem
							file={file}
							isFileNameUnique={uniqueFileNames.includes(
								file.name
							)}
							onItemClick={onItemClick}
						/>
					);
				}}
			/>
		</div>
	);
};

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
