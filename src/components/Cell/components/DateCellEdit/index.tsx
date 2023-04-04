import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";
import { dateToString } from "src/services/string/conversion";
import { isDate } from "util/types";

interface Props {
	value: string;
	onDateChange: (value: string) => void;
}

export default function DateCellEdit({ value, onDateChange }: Props) {
	function handleChange(date: Date | null) {
		let value = "";
		if (date) value = dateToString(date);
		onDateChange(value);
	}

	let selectedDate = new Date();
	if (isDate(value)) selectedDate = new Date(value);
	return (
		<DatePicker
			className="NLT__date-input"
			autoFocus
			selected={selectedDate}
			onChange={handleChange}
			dateFormat="yyyy/MM/dd"
			showYearDropdown
			dateFormatCalendar="MMMM"
			yearDropdownItemNumber={15}
			scrollableYearDropdown
		/>
	);
}
