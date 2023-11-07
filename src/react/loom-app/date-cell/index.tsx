import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";

import "./styles.css";

interface Props {
	value: string | null;
	format: DateFormat;
	formatSeparator: DateFormatSeparator;
}

export default function DateCell({ value, format, formatSeparator }: Props) {
	const content = getDateCellContent(value, format, formatSeparator);
	return <div className="dataloom-date-cell">{content}</div>;
}
