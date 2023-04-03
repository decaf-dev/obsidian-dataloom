import { useOverflowClassname } from "src/services/spacing/hooks";
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
	const overflowClassName = useOverflowClassname(
		useAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__number-cell" + " " + overflowClass;

	if (!isValidCellContent(content, CellType.NUMBER))
		content = filterNumberFromContent(content);
	return <div className={className}>{content}</div>;
}
