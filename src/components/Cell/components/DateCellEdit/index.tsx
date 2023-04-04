import Menu from "../../../Menu";

import DatePicker from "react-datepicker";
import { CellType } from "src/services/tableState/types";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";
import { dateToString } from "src/services/string/conversion";
import { isValidCellContent } from "src/services/tableState/utils";

interface Props {
	content: string;
	onDateChange: (updatedContent: string) => void;
}

export default function DateCellEdit({ content, onDateChange }: Props) {
	let selectedDate = new Date();
	if (isValidCellContent(content, CellType.DATE))
		selectedDate = new Date(content);

	function handleChange(date: Date) {
		const updatedContent = dateToString(date);
		onDateChange(updatedContent);
	}
	return (
		<DatePicker
			className="NLT__date-input"
			autoFocus={true}
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
