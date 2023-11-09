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
	includeTime: boolean;
	hour12: boolean;
}

export default function DateCell({
	value,
	format,
	formatSeparator,
	includeTime,
	hour12,
}: Props) {
	const content = getDateCellContent(
		value,
		format,
		formatSeparator,
		includeTime,
		hour12
	);
	return <div className="dataloom-date-cell">{content}</div>;
}
