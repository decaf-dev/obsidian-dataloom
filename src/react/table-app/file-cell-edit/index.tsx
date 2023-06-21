import { SuggestList } from "src/react/shared/suggest-list";
import { VaultFile } from "src/obsidian-shim/development/vault-file";
import {
	stripAlias,
	stripDoubleBrackets,
} from "src/react/table-app/text-cell-edit/utils";
import { getBasename } from "src/shared/link/link-utils";

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
			if (file.path.includes("/"))
				fileName = `${file.path}|${file.basename}`;
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
			const fileName = getBasename(value);
			link = `${value}|${fileName}`;
		}
		onChange(link);
		onMenuClose();
	}

	let filterValue = stripDoubleBrackets(value);
	filterValue = stripAlias(filterValue);

	return (
		<div className="NLT__file-cell-edit">
			<SuggestList
				filterValue={filterValue}
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
