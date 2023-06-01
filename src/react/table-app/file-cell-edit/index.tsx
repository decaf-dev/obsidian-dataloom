import { TFile } from "obsidian";
import SuggestMenuContent from "src/react/shared/suggest-menu/suggest-menu-context";

interface Props {
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function FileCellEdit({ onChange, onMenuClose }: Props) {
	function handleSuggestItemClick(
		file: TFile | null,
		isFileNameUnique: boolean
	) {
		if (file) {
			//The basename does not include an extension
			let fileName = file.basename;
			//The name includes an extension
			if (file.extension !== "md") fileName = file.name;
			//If the file name is not unique, add the path so that the system can find it
			if (!isFileNameUnique) fileName = `${file.path}|${fileName}`;
			onChange(`[[${fileName}]]`);
		}
		onMenuClose();
	}

	return (
		<div className="NLT__file-cell-edit">
			<SuggestMenuContent
				showInput
				onItemClick={handleSuggestItemClick}
			/>
		</div>
	);
}
