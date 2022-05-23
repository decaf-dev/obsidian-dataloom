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
	width: string;
	height: string;
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
	let minDate = new Date(selectedDate);
	minDate.setMonth(minDate.getMonth() - 6);
	let maxDate = new Date(selectedDate);
	maxDate.setMonth(minDate.getMonth() + 6);
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
				dateFormatCalendar={"MMM yyyy"}
				minDate={minDate}
				maxDate={maxDate}
				dateFormat="yyyy/MM/dd"
				showMonthYearDropdown
			/>
		</Menu>
	);
}
