import React from "react";
import Menu from "../Menu";

import DatePicker from "react-datepicker";
import { CellType } from "src/services/appData/state/types";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";
import { dateToString } from "src/services/string/conversion";
import { isValidCellContent } from "src/services/appData/state/utils";

interface Props {
	menuId: string;
	isOpen: boolean;
	style: {
		top: string;
		left: string;
		width: string;
		height: string;
	};
	content: string;
	onDateChange: (updatedContent: string) => void;
}

export default function DateCellEdit({
	menuId,
	isOpen,
	style,
	content,
	onDateChange,
}: Props) {
	let selectedDate = new Date();
	if (isValidCellContent(content, CellType.DATE))
		selectedDate = new Date(content);

	function handleChange(date: Date) {
		const updatedContent = dateToString(date);
		onDateChange(updatedContent);
	}
	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
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
		</Menu>
	);
}
