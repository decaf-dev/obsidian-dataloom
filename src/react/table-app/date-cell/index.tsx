import { DateFormat } from "src/shared/table-state/types";
import "./styles.css";
import { unixTimeToDateString } from "src/shared/date/date-conversion";
interface Props {
	value: number | null;
	format: DateFormat;
}

export default function DateCell({ value, format }: Props) {
	let content = "";
	if (value !== null) content = unixTimeToDateString(value, format);
	return <div className="NLT__date-cell">{content}</div>;
}
