import { CellType } from "src/services/tableState/types";

import {
	filterNumberFromContent,
	isValidCellContent,
} from "src/services/tableState/utils";

import "./styles.css";

interface Props {
	content: string;
	shouldWrapOverflow: boolean;
	useAutoWidth: boolean;
}

export default function NumberCell({
	content,
	shouldWrapOverflow,
	useAutoWidth,
}: Props) {
	let className = "NLT__number-cell";

	if (useAutoWidth) {
		className += " NLT__auto-width";
	} else {
		if (shouldWrapOverflow) {
			className += " NLT__wrap-overflow";
		} else {
			className += " NLT__hide-overflow";
		}
	}

	if (!isValidCellContent(content, CellType.NUMBER))
		content = filterNumberFromContent(content);
	return <div className={className}>{content}</div>;
}
