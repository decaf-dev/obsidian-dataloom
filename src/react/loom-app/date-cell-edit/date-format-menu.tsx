import React from "react";

import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";

import { getDisplayNameForDateFormat } from "src/shared/loom-state/display-name";
import { DateFormat } from "src/shared/types";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	value: DateFormat;
	onChange: (value: DateFormat) => void;
}

const DateFormatMenu = React.forwardRef<HTMLDivElement, Props>(
	function DateFormatMenu(
		{ id, top, left, isOpen, value, onChange }: Props,
		ref
	) {
		//TODO add all formats
		return (
			<Menu
				ref={ref}
				isOpen={isOpen}
				id={id}
				top={top}
				left={left}
				width={175}
			>
				<div className="dataloom-date-format-menu">
					{Object.values([
						DateFormat.DD_MM_YYYY,
						DateFormat.MM_DD_YYYY,
						DateFormat.YYYY_MM_DD,
					]).map((format) => (
						<MenuItem
							key={format}
							name={getDisplayNameForDateFormat(format)}
							isSelected={value === format}
							onClick={() => {
								onChange(format);
							}}
						/>
					))}
				</div>
			</Menu>
		);
	}
);

export default DateFormatMenu;
