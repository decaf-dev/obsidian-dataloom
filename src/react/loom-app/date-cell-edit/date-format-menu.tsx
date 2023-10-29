import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import { LoomMenuPosition } from "src/react/shared/menu/types";

import { getDisplayNameForDateFormat } from "src/shared/loom-state/type-display-names";
import { DateFormat } from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	value: DateFormat;
	onChange: (value: DateFormat) => void;
}

export default function DateFormatMenu({
	id,
	position,
	isOpen,
	value,
	onChange,
}: Props) {
	//TODO add all formats
	return (
		<Menu
			isOpen={isOpen}
			id={id}
			position={position}
			width={175}
			topOffset={10}
			leftOffset={75}
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
