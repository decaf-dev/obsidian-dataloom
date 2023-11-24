import { TFile } from "obsidian";

import { SuggestList } from "src/react/shared/suggest-list";
import {
	isMarkdownFile,
	stripFileExtension,
} from "src/shared/link-and-path/file-path-utils";

interface Props {
	onChange: (value: string) => void;
	onClose: () => void;
}

export default function FileCellEdit({ onChange, onClose }: Props) {
	function handleSuggestItemClick(file: TFile | null) {
		if (file) {
			let path = file.path;
			if (isMarkdownFile(path)) path = stripFileExtension(path);
			onChange(path);
		}
		onClose();
	}

	function handleClearClick() {
		onChange("");
		onClose();
	}

	function handleCreateClick(value: string) {
		if (isMarkdownFile(value)) value = stripFileExtension(value);
		onChange(value);
		onClose();
	}

	return (
		<div className="dataloom-file-cell-edit">
			<SuggestList
				showInput
				showClear
				showCreate
				onItemClick={handleSuggestItemClick}
				onClearClick={handleClearClick}
				onCreateClick={handleCreateClick}
			/>
		</div>
	);
}
