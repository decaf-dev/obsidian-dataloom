import Menu from "../../../Menu";

import DatePicker from "react-datepicker";
import { CellType } from "src/services/tableState/types";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";
import { dateToString } from "src/services/string/conversion";
import { isValidCellContent } from "src/services/tableState/utils";

interface Props {
	value: string;
	onDateChange: (value: string) => void;
}

export default function DateCellEdit({ value, onDateChange }: Props) {
	let selectedDate = new Date();
	if (isValidCellContent(value, CellType.DATE))
		selectedDate = new Date(value);

	function handleChange(date: Date | null) {
		let value = "";
		if (date) value = dateToString(date);
		onDateChange(value);
	}
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
