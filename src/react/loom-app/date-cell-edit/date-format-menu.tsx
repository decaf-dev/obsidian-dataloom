import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

import { getDisplayNameForDateFormat } from "src/shared/loom-state/type-display-names";
import { DateFormat } from "src/shared/loom-state/types/loom-state";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	value: DateFormat;
	onChange: (value: DateFormat) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function DateFormatMenu({
	id,
	triggerPosition,
	isOpen,
	value,
	onChange,
	onRequestClose,
	onClose,
}: Props) {
	//TODO add all formats
	return (
		<Menu
			isOpen={isOpen}
			id={id}
			triggerPosition={triggerPosition}
			width={175}
			onRequestClose={onRequestClose}
			onClose={onClose}
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
