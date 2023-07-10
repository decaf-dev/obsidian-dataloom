import React from "react";
import Menu from "src/react/shared/menu";
import MenuItem from "src/react/shared/menu-item";
import {
	getAriaLabelForCalculation,
	getAriaLabelForNumberCalculation,
	getDisplayNameForCalculation,
	getDisplayNameForNumberCalculation,
} from "src/shared/loom-state/display-name";
import {
	Calculation,
	CalculationType,
	CellType,
	NumberCalculation,
} from "src/shared/types";

interface Props {
	id: string;
	value: CalculationType;
	cellType: CellType;
	isOpen: boolean;
	top: number;
	left: number;
	onClick: (value: CalculationType) => void;
}
const CalculationMenu = React.forwardRef<HTMLDivElement, Props>(
	function CalculationMenu(
		{ id, value, cellType, isOpen, top, left, onClick }: Props,
		ref
	) {
		return (
			<Menu ref={ref} id={id} isOpen={isOpen} top={top} left={left}>
				<div className="DataLoom__function-menu">
					{Object.values(Calculation).map((type) => (
						<MenuItem
							key={type}
							name={getDisplayNameForCalculation(type)}
							ariaLabel={getAriaLabelForCalculation(type)}
							onClick={() => onClick(type)}
							isSelected={type === value}
						/>
					))}
					{(cellType === CellType.NUMBER ||
						cellType === CellType.CURRENCY) &&
						Object.values(NumberCalculation).map((type) => (
							<MenuItem
								key={type}
								ariaLabel={getAriaLabelForNumberCalculation(
									type
								)}
								name={getDisplayNameForNumberCalculation(type)}
								onClick={() => onClick(type)}
								isSelected={type === value}
							/>
						))}
				</div>
			</Menu>
		);
	}
);

export default CalculationMenu;
