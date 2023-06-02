import { DateFormat } from "src/shared/types/types";
import { getDateCellContent } from "src/shared/export/cell-content";

import "./styles.css";

interface Props {
	value: number | null;
	format: DateFormat;
}

export default function DateCell({ value, format }: Props) {
	const content = getDateCellContent(value, format);
	return <div className="NLT__date-cell">{content}</div>;
}
