import React from "react";
import Menu from "../Menu";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";

interface Props {
	menuId: string;
	isOpen: boolean;
	top: number;
	left: number;
	width: number;
	height: number;
	selectedDate: Date;
	onDateChange: (date: Date) => void;
}

export default function DateCellEdit({
	menuId,
	isOpen,
	top,
	left,
	width,
	height,
	selectedDate,
	onDateChange,
}: Props) {
	return (
		<Menu
			id={menuId}
			isOpen={isOpen}
			top={top}
			left={left}
			width={width}
			height={height}
		>
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
