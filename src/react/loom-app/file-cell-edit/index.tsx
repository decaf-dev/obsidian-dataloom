import { TFile } from "obsidian";

import { SuggestList } from "src/react/shared/suggest-list";
import { getBasename } from "src/shared/link/link-utils";

interface Props {
	onChange: (value: string) => void;
	onClose: () => void;
}

export default function FileCellEdit({ onChange, onClose }: Props) {
	function handleSuggestItemClick(file: TFile | null) {
		if (file) {
			//The basename does not include an extension
			let fileName = file.basename;
			if (file.path.includes("/"))
				fileName = `${file.path}|${file.basename}`;
			onChange(`[[${fileName}]]`);
		}
		onClose();
	}

	function handleClearClick() {
		onChange("");
		onClose();
	}

	function handleCreateClick(value: string) {
		let link = `[[${value}]]`;
		if (value.includes("/")) {
			const fileName = getBasename(value);
			link = `${value}|${fileName}`;
		}
		onChange(link);
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
