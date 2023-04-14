import Menu from "src/components/Menu";
import MenuItem from "src/components/MenuItem";
import { DateFormat } from "src/services/tableState/types";
import { getDisplayNameForDateFormat } from "src/services/tableState/utils";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	value: DateFormat;
	onChange: (value: DateFormat) => void;
}

export default function DateFormatMenu({
	id,
	top,
	left,
	isOpen,
	value,
	onChange,
}: Props) {
	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={175}>
			<div className="NLT__currency-menu">
				{Object.values([
					DateFormat.DD_MM_YYYY,
					DateFormat.MM_DD_YYYY,
					DateFormat.YYYY_MM_DD,
				]).map((format) => (
					<MenuItem
						key={format}
						name={getDisplayNameForDateFormat(format)}
						isSelected={value === format}
						onClick={() => onChange(format)}
					/>
				))}
			</div>
		</Menu>
	);
}
