import { DateFormat } from "src/shared/loom-state/types";
import { getDateCellContent } from "src/shared/cell-content/date-cell-content";

import "./styles.css";
import { useOverflow } from "src/shared/spacing/hooks";

interface Props {
	value: number | null;
	format: DateFormat;
}

export default function DateCell({ value, format }: Props) {
	const overflowClassName = useOverflow(false, {
		ellipsis: true,
	});
	let className = "dataloom-date-cell";
	className += " " + overflowClassName;
	const content = getDateCellContent(value, format);
	return <div className={className}>{content}</div>;
}
