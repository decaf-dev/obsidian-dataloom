import { DateFormat } from "src/data/types";
import "./styles.css";
import DateConversion from "src/services/date/DateConversion";
interface Props {
	value: number | null;
	format: DateFormat;
}

export default function DateCell({ value, format }: Props) {
	let content = "";
	if (value !== null)
		content = DateConversion.unixTimeToDateString(value, format);
	return <div className="NLT__date-cell">{content}</div>;
}
