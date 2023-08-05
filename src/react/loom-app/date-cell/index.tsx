import { DateFormat } from "src/shared/loom-state/types";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";

import "./styles.css";

interface Props {
	value: number | null;
	format: DateFormat;
}

export default function DateCell({ value, format }: Props) {
	const content = getDateCellContent(value, format);
	return <div className="dataloom-date-cell">{content}</div>;
}
