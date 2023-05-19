import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import {
	getDisplayNameForGeneralFunction,
	getAriaLabelForGeneralFunction,
	getAriaLabelForNumberFunction,
	getDisplayNameForNumberFunction,
} from "src/shared/table-state/display-name";
import {
	CellType,
	FunctionType,
	GeneralFunction,
	NumberFunction,
} from "src/shared/table-state/types";

interface Props {
	id: string;
	value: FunctionType;
	cellType: CellType;
	isOpen: boolean;
	isReady: boolean;
	top: number;
	left: number;
	onClick: (value: FunctionType) => void;
}
export default function FunctionMenu({
	id,
	value,
	cellType,
	isReady,
	isOpen,
	top,
	left,
	onClick,
}: Props) {
	return (
		<Menu id={id} isOpen={isOpen} isReady={isReady} top={top} left={left}>
			<div className="NLT__function-menu">
				{Object.values(GeneralFunction).map((type) => (
					<MenuItem
						key={type}
						name={getDisplayNameForGeneralFunction(type)}
						ariaLabel={getAriaLabelForGeneralFunction(type)}
						onClick={() => onClick(type)}
						isSelected={type === value}
					/>
				))}
				{(cellType === CellType.NUMBER ||
					cellType === CellType.CURRENCY) &&
					Object.values(NumberFunction).map((type) => (
						<MenuItem
							key={type}
							ariaLabel={getAriaLabelForNumberFunction(type)}
							name={getDisplayNameForNumberFunction(type)}
							onClick={() => onClick(type)}
							isSelected={type === value}
						/>
					))}
			</div>
		</Menu>
	);
}
