import { useRef } from "react";
import { CellType } from "src/services/tableState/types";
import {
	filterNumberFromContent,
	isValidCellContent,
} from "src/services/tableState/utils";

import "./styles.css";

interface Props {
	content: string;
	onInputChange: (updatedContent: string) => void;
}

export default function NumberCellEdit({ content, onInputChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleInputChange(value: string) {
		value = value.replace("\n", "");
		return onInputChange(value);
	}

	if (!isValidCellContent(content, CellType.NUMBER))
		content = filterNumberFromContent(content);

	return (
		<input
			className="NLT__number-cell-edit"
			type="number"
			ref={inputRef}
			autoFocus
			value={content}
			onChange={(e) => handleInputChange(e.target.value)}
		/>
	);
}
