import SuggestMenuContent from "src/react/shared/suggest-menu/suggest-menu-content";
import { VaultFile } from "src/obsidian-shim/development/vault-file";
import { stripDoubleBrackets } from "src/react/shared/suggest-menu/utils";
import { stripDirectory } from "src/shared/link/link-utils";

interface Props {
	value: string;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function FileCellEdit({ value, onChange, onMenuClose }: Props) {
	function handleSuggestItemClick(file: VaultFile | null) {
		if (file) {
			//The basename does not include an extension
			let fileName = file.basename;
			//The name includes an extension
			if (file.extension !== "md") fileName = file.name;
			if (file.path.includes("/")) fileName = `${file.path}|${fileName}`;
			onChange(`[[${fileName}]]`);
		}
		onMenuClose();
	}

	function handleClearClick() {
		onChange("");
		onMenuClose();
	}

	function handleCreateClick(value: string) {
		let link = `[[${value}]]`;
		if (value.includes("/")) {
			const fileName = stripDirectory(value);
			link = `${value}|${fileName}`;
		}
		onChange(link);
		onMenuClose();
	}

	return (
		<div className="NLT__file-cell-edit">
			<SuggestMenuContent
				filterValue={stripDoubleBrackets(value)}
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
