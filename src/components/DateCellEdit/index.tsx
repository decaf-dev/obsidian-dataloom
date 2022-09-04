import React from "react";
import Menu from "../Menu";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	style: {
		top: string;
		left: string;
		width: string;
		height: string;
	};
	selectedDate: Date;
	onDateChange: (date: Date) => void;
}

export default function DateCellEdit({
	menuId,
	isOpen,
	style,
	selectedDate,
	onDateChange,
}: Props) {
	return (
		<Menu id={menuId} isOpen={isOpen} style={style}>
			<DatePicker
				className="NLT__date-input"
				autoFocus={true}
				selected={selectedDate}
				onChange={onDateChange}
				dateFormat="yyyy/MM/dd"
				showYearDropdown
				dateFormatCalendar="MMMM"
				yearDropdownItemNumber={15}
				scrollableYearDropdown
			/>
		</Menu>
	);
}
